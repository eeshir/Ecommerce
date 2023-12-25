const ErrorHandler = require("../utils/errorhander");

module.exports = (err,req,res,next)=>{
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;
    
// Mongodb Cast Error

if(err.name == "CastError"){
    const message = 'Resouce not found. Invalid:' + err.path;
    err = new ErrorHandler(message, 400);
}

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};