const { StatusCodes } = require("http-status-codes");
const firebaseAdmin = require("../utils/firebase-admin");
const { createJWT } = require("../utils/jwt");

const { Users, Counter } = require("../models");

const signUp = async (req, res) => {
  try {
    const user = req.user;

    let newUser = await Users.findOne({ email: user.email });
    if (newUser) {
      let token = createJWT(newUser);
      return res.status(StatusCodes.OK).json({
        message: "User already exists.",
        data: newUser,
        error: {},
        status: StatusCodes.OK,
        token: token,
      });
    }

    const counter = await Counter.findOneAndUpdate(
      {
        _id: "entityId",
      },
      {
        $inc: {
          seq: 1,
        },
      },
      {
        new: true,
        upsert: true,
      }
    );

    newUser = await Users.create({
      zid: `ZEN${String(counter.seq).padStart(6, "0")}`,
      email: user.email,
      profilePic: user.picture,
    });
    if (user.firebase.sign_in_provider === "google.com") {
      newUser = await Users.findOneAndUpdate(
        {
          email: user.email,
        },
        {
          $set: {
            name: user.name,
          },
        },
        {
          new: true,
        }
      );
    }

    let token = createJWT(newUser);

    res.cookie("userToken", token, { maxAge: 900000, httpOnly: true });

    return res.status(StatusCodes.CREATED).json({
      message: "User created successfully",
      data: newUser,
      error: {},
      token: token,
      status: StatusCodes.CREATED,
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
      data: {},
      error: {
        message: err.message,
      },
      token: null,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};

const profile = async (req, res) => {};

const register = async (req, res) => {
  try {
    const { name, phone, regNo, branch } = req.body;
    const user = req.user;

    let newUser = await Users.findById(user._id);
    if (newUser) {
      newUser = await Users.findOneAndUpdate(
        { _id: user._id },
        {
          $set: {
            name,
            phone,
            regNo,
            branch,
            isVerified: true,
          },
        },
        {
          new: true,
        }
      );
      return res.status(StatusCodes.OK).json({
        message: "User updated successfully",
        data: newUser,
        error: {},
        status: StatusCodes.OK,
      });
    }

    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "User does not exist",
      data: {},
      error: {},
      status: StatusCodes.BAD_REQUEST,
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal Server Error",
      data: {},
      error: {
        message: err.message,
      },
      token: null,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};

const signIn = async (req, res) => {
  const user = req.user;
  try {
    let newUser = await Users.findOne({ email: user.email });
    if (newUser) {
      let token = createJWT(newUser);

      res.cookie("userToken", token, { maxAge: 900000, httpOnly: true });

      return res.status(StatusCodes.OK).json({
        message: "User signed in successfully",
        data: newUser,
        error: {},
        status: StatusCodes.OK,
        token: token,
      });
    }
    return res.status(StatusCodes.NOT_FOUND).json({
      message: "User does not exist. Please sign up.",
      data: {},
      error: {
        message: "User does not exist",
      },
      status: StatusCodes.NOT_FOUND,
      token: null,
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "User created successfully",
      data: newUser,
      error: {
        message: err.message,
      },
      token: null,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};

module.exports = {
  signUp,
  profile,
  signIn,
  register,
};
