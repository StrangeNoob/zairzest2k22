const { StatusCodes } = require("http-status-codes");
const firebaseAdmin = require("../utils/firebase-admin");
const { createJWT } = require("../utils/jwt");

const { Users, Counter } = require("../models/index");

const signIn = async (req, res) => {
  const { name: userName, provider } = req.body;
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
    name:
      user.firebase.sign_in_provider === "google.com" ? user.name : userName,
    email: user.email,
    profilePic: user.picture,
  });

  let token = createJWT(newUser);
  
  res.cookies("userToken", token,{ maxAge: 900000, httpOnly: true });

  return res.status(StatusCodes.CREATED).json({
    message: "User created successfully",
    data: newUser,
    error: {},
    status: StatusCodes.CREATED,
  });
};

const profile = async (req, res) => {};

const register = async (req, res) => {
  const { phone, regNo, branch } = req.body;
  const user = req.user;

  let newUser = await Users.findOne({ email: user.email });
  if (newUser) {
    newUser = await Users.findOneAndUpdate(
      { email: user.email },
      {
        phone,
        regNo,
        branch,
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

module.exports = {
  signIn,
  profile,
  register
};
