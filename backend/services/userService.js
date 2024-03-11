// const { customID } = require("../database/utils");
const user = require("../database/userDB")

const getMe = async (id) => {
  try {
    const retrivedUser = await user.getMe(id);
    return retrivedUser;
  } catch (error) {
    throw error;
  }
};

const refreshToken = async (refreshToken) => {
  try {
    const newRefreshToken = await user.refreshToken(refreshToken);
    return newRefreshToken;
  } catch (error) {
    throw error;
  }
};

const registerUser = async (newUser) => {
  try {
    const createdUser = await user.registerUser(newUser);
    return createdUser;
  } catch (error) {
    throw error;
  }
};

const loginUser = async (loginUser) => {
  try {
    const retrivedUser = await user.loginUser(loginUser);
    return retrivedUser;
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (id) => {
  try {
    const deletedUser = await user.deleteUser(id);
    return deletedUser;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getMe,
  refreshToken,
  registerUser,
  loginUser,
  deleteUser,
};