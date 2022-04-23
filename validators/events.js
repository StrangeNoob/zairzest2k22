const { StatusCodes } = require("http-status-codes");
const { Users } = require("../models/index");
const { verifyJWT } = require("../utils/jwt");

const postRegisterEvent = async (req, res, next) => {
  try {
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
    }
    if (eventId == null) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "EventId Params is missing",
        data: {},
        error: {
          message: "EventId Params is missing",
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
const postDeRegisterEvent = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const { eventId } = req.params;
    if (authorization == null) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Authorization header is missing",
        data: {},
        error: {
          message: "Authorization header is missing",
        },
        status: StatusCodes.UNAUTHORIZED,
      });
    }
    if (eventId == null) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "EventId Params is missing",
        data: {},
        error: {
          message: "EventId Params is missing",
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

const getAllByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;

    if (category == null) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Category Params is missing",
        data: {},
        error: {
          message: "Category Params is missing",
        },
        status: StatusCodes.BAD_REQUEST,
      });
    }
    return next();
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

module.exports = {
  getAllByCategory,
  postRegisterEvent,
  postDeRegisterEvent,
};
