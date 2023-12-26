const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthUser = catchAsyncErrors(async(req,res,next)=>{

    const {token} = req.cookies;
    // console.log(token);
    if(!token)
        return next(new ErrorHander("Please login to access this Page",401));

    const decodedData = jwt.verify(token,process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id);
    // console.log(decodedData);
    // console.log(req.user);

    next();
});

exports.authRoles = (...roles)=>{

    return async(req,res,next)=>{
        const {token} = req.cookies;
        const decodedData = jwt.verify(token,process.env.JWT_SECRET);
        req.user = await User.findById(decodedData.id);

        if(!roles.includes(req.user.role))
        {
                return next (new ErrorHander('Role: '+ req.user.role + ' is not allowed to access this page',403));
        }

        next();
    };
};