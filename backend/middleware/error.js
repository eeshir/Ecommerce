const ErrorHandler = require("../utils/errorhander");

module.exports = (err,req,res,next)=>{
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;
    
// Mongodb Cast Error
if(err.name == "CastError"){
    const message = 'Resouce not found. Invalid:' + err.path;
    err = new ErrorHandler(message, 400);
}

// JWT ERROR
if(err.name == "JsonWebTokenError"){
    const message = `Json Web Token is Invalid, Try Again`;
    err = new ErrorHandler(message, 400);
}

// JWT Expire error
if(err.name == "TokenExpiredError"){
    const message = `Json Web Token is Expired, Try Again`;
    err = new ErrorHandler(message, 400);
}

// Mongoose Duplicate Key Error
if(err.code === 11000){
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
    err = new ErrorHandler(message, 400);
}

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};