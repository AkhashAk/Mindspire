const jwt = require("jsonwebtoken");
const User = require("../database/userModal");
const { promisify } = require('util');
const { getMe } = require("../database/userDB");

const authUser = async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    let token = authHeader.split(' ')[1];
    if (token == undefined) return null;
    try {
        if (token !== undefined && token !== null) {
            let currentDate = new Date();
            const decodedToken = jwt.decode(token);
            if (decodedToken.exp * 1000 < currentDate.getTime()) {
                try {
                    const retrivedUser = await User.findById(decodedToken.id).select("-password");
                    const oldRefreshToken = retrivedUser.refreshToken[0];

                    if (!oldRefreshToken) throw { status: 500, message: "You are not authenticated!" };

                    const foundUser = await User.findOne({ refreshToken: oldRefreshToken });

                    if (!foundUser) {
                        const decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);
                        const hackedUser = await getMe(decoded.id);
                        hackedUser.refreshToken = [];
                        const result = await User.findOneAndUpdate({ _id: hackedUser._id }, { refreshToken: hackedUser.refreshToken }, { new: true });
                        throw { status: 500, message: "Forbidden" }; //Forbidden
                    }

                    const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== oldRefreshToken);

                    let newAccessToken;
                    let newRefreshToken;

                    const decoded = await promisify(jwt.verify)(oldRefreshToken, process.env.JWT_REFRESH_SECRET);

                    if (foundUser.id !== decoded.id) throw { status: 403, message: "Forbidden" };

                    newAccessToken = jwt.sign({ id: decoded.id, emailID: foundUser.emailID }, process.env.JWT_SECRET, { expiresIn: "10s" });
                    newRefreshToken = jwt.sign({ id: decoded.id, emailID: foundUser.emailID }, process.env.JWT_REFRESH_SECRET);


                    foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
                    const result = await User.findOneAndUpdate({ _id: foundUser.id }, { refreshToken: foundUser.refreshToken }, {
                        new: true
                    });

                    token = newAccessToken;
                    req.headers.authorization = `Bearer ${newAccessToken}`;

                } catch (error) {
                    console.error(error);
                    return res.status(error.status || 500).json({ message: error.message || error });
                }
            }
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decode.id).select("-password");
            next();
        }
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: err?.message });
    }
}

module.exports = { authUser };