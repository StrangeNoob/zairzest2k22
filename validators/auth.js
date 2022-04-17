const { StatusCodes } = require('http-status-codes');
const firebaseAdmin = require('../utils/firebase-admin')

const signIn = async (req,res,next) => {
    const { authorization } = req.headers;
    const { name, provider } = req.body;
    if(authorization == null ) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "Authorization header is missing",
            data: {},
            error: {
                message: "Authorization header is missing"
            },
            status: StatusCodes.UNAUTHORIZED
        });
    } else  {
        try {
            const user = await firebaseAdmin.auth().verifyIdToken(authorization);
            console.log(user);
            if(name == null && user.firebase.sign_in_provider === 'password')  {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: "Name is missing",
                    data: {},
                    error: {
                        message: "Name is missing"
                    },
                    status: StatusCodes.BAD_REQUEST
                });
            }    
            req.user = user;        
            next();
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Internal server error",
                data: {},
                error: {
                    message: err.message
                },
                status: StatusCodes.INTERNAL_SERVER_ERROR
            });
        }
    } 

}

const profile = async (req,res) => {

}



module.exports = {
    signIn,
    profile
}