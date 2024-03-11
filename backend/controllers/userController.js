const jwt = require("jsonwebtoken");
const User = require("../database/userModal");
const userService = require("../services/userService");

const getMe = async (req, res) => {
  try {
    const retrivedUser = await userService.getMe(req.user._id);
    res.json(retrivedUser);
  } catch (error) {
    res
      .status(error?.status || 500)
      .json({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const registerUser = async (req, res) => {
  const { body } = req;
  if (
    !body.name ||
    !body.emailID ||
    !body.password
  ) {
    res.status(400).json({
      status: "FAILED",
      data: {
        error: "Request body missing some of the properties",
      },
    });
    return;
  }
  try {
    const user = {
      name: body.name,
      emailID: body.emailID,
      password: body.password
    };
    const newUser = await userService.registerUser(user);
    if (newUser?.status === 201) {
      res.status(201).json(newUser);
    } else if (newUser?.status === 400) {
      res.status(400).json(newUser);
    }
  } catch (error) {
    res
      .status(error?.status || 500)
      .json({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const loginUser = async (req, res) => {
  try {
    const { emailID, password } = req.body;
    if (!emailID || !password) {
      throw res.status(400).json({ status: "FAILED", message: "Email Id or password can not be empty!", });
    }
    const retrivedUser = await userService.loginUser({ emailID, password });
    if (retrivedUser?.status === "401") {
      return res.status(401).json(retrivedUser);
    } else {
      return res.status(200).json(retrivedUser);
    }
  } catch (error) {
    throw res
      .status(error?.status || 500)
      .json({ status: "FAILED", data: { error: error?.message || error } });
  }
};

module.exports = {
  getMe,
  registerUser,
  loginUser,
};