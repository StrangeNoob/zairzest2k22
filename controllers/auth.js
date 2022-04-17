const { StatusCodes } = require('http-status-codes');
const firebaseAdmin = require('../utils/firebase-admin')

const { Users, Counter } = require('../models/index');

const signIn = async (req,res) => {
    const { name: userName, provider } = req.body;
    const user = req.user;

    let newUser = await Users.findOne({'email':user.email});
    if(newUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "User already exists",
        data: {},
        error: {},
        status: StatusCodes.BAD_REQUEST
      });
    }

    const counter = await Counter.findOneAndUpdate({
        _id: 'entityId'
      }, {
        $inc: {
          seq: 1
        }
      }, {
        new: true,
        upsert: true,
    });

    console.log(req.user);

    newUser = await Users.create({
      zid: `ZEN${String(counter.seq).padStart(6, '0')}`,
      name: user.firebase.sign_in_provider === 'google.com' ? user.name : userName,
      email: user.email,
      profilePic: user.picture,
    });
    
    
    return res.status(StatusCodes.CREATED).json({
      message: "User created successfully",
      data: newUser,
      error: {},
      status: StatusCodes.CREATED
    });
    
}

const profile = async (req,res) => {

}



module.exports = {
    signIn,
    profile
}