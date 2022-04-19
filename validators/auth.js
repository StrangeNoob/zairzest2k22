const { StatusCodes } = require("http-status-codes");
const firebaseAdmin = require("../utils/firebase-admin");
const { Users } = require("../models/index");
const { verifyJWT } = require("../utils/jwt");

const signUp = async (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization == null) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Authorization header is missing",
      data: {},
      error: {
        message: "Authorization header is missing",
      },
      status: StatusCodes.UNAUTHORIZED,
    });
  } else {
    try {
      const user = await firebaseAdmin.auth().verifyIdToken(authorization);
      req.user = user;
      return next();
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
        data: {},
        error: {
          message: err.message,
        },
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  }
};

const register = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const { name, phone, regNo, branch } = req.body;
    if (authorization == null) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Authorization header is missing",
        data: {},
        error: {
          message: "Authorization header is missing",
        },
        status: StatusCodes.UNAUTHORIZED,
      });
    } else if (
      name == null ||
      phone == null ||
      regNo == null ||
      branch == null
    ) {
      console.log(name, phone, regNo, branch);
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Name, Phone, regNo and branch are required",
        data: {},
        error: {
          message: "Name, Phone, regNo and branch are required",
        },
        status: StatusCodes.BAD_REQUEST,
      });
    } else if (
      !String(phone).match(/^[0-9]{10}$/) ||
      !String(regNo).match(/^[0-9]{10}$/)
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message:
          "Phone and regNo must be 10 digits and regNo must be 10 digits",
        data: {},
        error: {
          message:
            "Phone and regNo must be 10 digits and regNo must be 10 digits",
        },
        status: StatusCodes.BAD_REQUEST,
      });
    } else if (branch == null) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Branch is required",
        data: {},
        error: {
          message: "Branch is required",
        },
        status: StatusCodes.BAD_REQUEST,
      });
    }

    const { status, data, error } = verifyJWT(authorization);
    if (status) {
      const user = await Users.findById({ _id: data.id });
      req.user = user;
      return next();
    }
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "JWT Verification Failed",
      data: {},
      error: {
        message: error,
      },
      status: StatusCodes.UNAUTHORIZED,
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
      data: {},
      error: {
        message: err.message,
      },
    });
  }
};

const signIn = async (req, res, next) => {
  const { authorization } = req.headers;
  try {
    if (authorization == null) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Authorization header is missing",
        data: {},
        error: {
          message: "Authorization header is missing",
        },
        status: StatusCodes.UNAUTHORIZED,
      });
    } else {
      try {
        const user = await firebaseAdmin.auth().verifyIdToken(authorization);
        req.user = user;
        return next();
      } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: "Internal server error",
          data: {},
          error: {
            message: err.message,
          },
          status: StatusCodes.INTERNAL_SERVER_ERROR,
        });
      }
    }
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
      data: {},
      error: {
        message: err.message,
      },
    });
  }
};

const profile = async (req, res) => {};

module.exports = {
  signUp,
  register,
  profile,
  signIn,
};
