const jwt = require("jsonwebtoken");
const User = require("./userModal");
const bcrypt = require("bcrypt");


var refreshTokens = [];

const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "10sec" });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET);
};

const getMe = async (id) => {
  try {
    const { _id, name, emailID } = await User.findOne({ _id: id });
    return { _id, name, emailID };
  } catch (err) {
    throw err;
  }
};

const registerUser = async (newUser) => {
  try {
    // const isPresent = DB.users.findIndex((user) => user.userName == newUser.userName) > -1;
    const { name, emailID, password } = newUser;
    const isUserPresent = await User.findOne({ emailID });
    if (isUserPresent) {
      return ({
        status: 400,
        message: `User with email id ${emailID} already exists`,
      });
    }
    // DB.users.push(newUser);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = await User.create({
      name,
      emailID,
      password: hashedPassword
    });
    return ({ status: 201, createdUser });
  } catch (error) {
    throw { status: 500, message: error?.message || error };
  }
};

const loginUser = async (loginUser) => {
  try {
    const retrivedDBUser = await User.findOne({ emailID: loginUser.emailID });

    if (!retrivedDBUser) return ({ status: "401", message: "User not found! Sign up and try again" });

    const decodedPassword = await bcrypt.compare(loginUser.password, retrivedDBUser.password);

    if (retrivedDBUser && decodedPassword) {
      const newRefreshToken = generateRefreshToken(retrivedDBUser._id);
      retrivedDBUser.refreshToken = [newRefreshToken];
      const result = await User.findOneAndUpdate({ _id: retrivedDBUser._id }, { refreshToken: retrivedDBUser.refreshToken });

      return ({
        _id: retrivedDBUser._id,
        name: retrivedDBUser.name,
        emailID: retrivedDBUser.emailID,
        token: generateAccessToken(retrivedDBUser._id),
        refreshToken: newRefreshToken,
      });
    } else {
      return ({ status: "401", message: "Incorrect email ID or password!" });
    }
  } catch (error) {
    console.log(error);
    throw { status: 500, message: error?.message || error };
  }
};

const deleteUser = async (id) => {
  try {
    const retrivedUser = getMe(id);
    if (!retrivedUser) {
      throw {
        status: 404,
        message: `User with Email ID: ${id} doesn't exist`,
      };
    }
    const deletedUser = await User.findOneAndDelete({ id: id }, { new: true });
    return deletedUser;
  } catch (error) {
    throw { status: 500, message: error?.message || error };
  }
};

module.exports = {
  getMe,
  registerUser,
  loginUser,
  deleteUser,
};