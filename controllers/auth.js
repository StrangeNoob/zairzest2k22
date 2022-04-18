const { StatusCodes } = require("http-status-codes");
const firebaseAdmin = require("../utils/firebase-admin");
const { createJWT } = require("../utils/jwt");

const { Users, Counter } = require("../models/index");

const signUp = async (req, res) => {
  const user = req.user;

  let newUser = await Users.findOne({ email: user.email });
  if (newUser) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "User already exists",
      data: {},
      error: {},
      status: StatusCodes.BAD_REQUEST,
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
};

const profile = async (req, res) => {};

const register = async (req, res) => {
  const { name, phone, regNo, branch } = req.body;
  const user = req.user;

  let newUser = await Users.findOne({ email: user.email });
  if (newUser) {
    newUser = await Users.findOneAndUpdate(
      { email: user.email },
      {
        $set: {
          name,
          phone,
          regNo,
          branch,
        },
      },
      {
        new: true,
      }
    );
    return res.status(StatusCodes.CREATED).json({
      message: "User created successfully",
      data: newUser,
      error: {},
      status: StatusCodes.CREATED,
    });
  }

  return res.status(StatusCodes.BAD_REQUEST).json({
    message: "User does not exist",
    data: {},
    error: {},
    status: StatusCodes.BAD_REQUEST,
  });
};

const signIn = async (req, res) => {
  const user = req.user;
  let newUser = await Users.findOne({ email: user.email });
  if (newUser) {
    let token = createJWT(newUser);

    res.cookies("userToken", token, { maxAge: 900000, httpOnly: true });
  
    return res.status(StatusCodes.OK).json({
      message: "User signed in successfully",
      data: newUser,
      error: {},
      status: StatusCodes.OK,
      token: token,
    });
  }
  return res.status(StatusCodes.NOT_FOUND).json({
    message: "User does not exist",
    data: {},
    error: {
      message: "User does not exist",
    },
    status: StatusCodes.NOT_FOUND,  
    token: null
  });
}

module.exports = {
  signUp,
  profile,
  signIn,
  register,
};
