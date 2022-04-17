const { StatusCodes } = require('http-status-codes');
const firebaseAdmin = require('../utils/firebase-admin')

const { Users, Counter } = require('./models/index');

const signIn = async (req,res) => {
    const { name: userName, provider } = req.body;
    const user = req.user;

    const counter =   counter.findOneAndUpdate({
        _id: 'entityId'
      }, {
        $inc: {
          seq: 1
        }
      }, {
        new: true,
        upsert: true,
    });

    console.log(counter);

    
}

const profile = async (req,res) => {

}



module.exports = {
    signUp,
    profile
}