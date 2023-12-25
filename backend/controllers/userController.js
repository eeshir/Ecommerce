const ErrorHander = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncErrors");

const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");

//Register a User
exports.registerUser = catchAsyncError(async(req,res,next)=>{

    const {name,email,password} = req.body;

    const user = await User.create({
        name,email,password,
        avatar:{
            public_id:"temp id",
            url:"temp url"
        }
    });
    
// Getting JWT token
   sendToken(user,201,res);
});

// User Login

exports.loginUser = catchAsyncError(async(req,res,next)=>{
    const{email,password} = req.body;

    // email and password validation

    if(!email || !password)
        return next(new ErrorHander("Please Enter Email And Password",400));

        // If email and pass exists then find them
        const user = await User.findOne({email}).select("+password");
    // In case of no match
        if(!user)
            return next(new ErrorHander("Invalid Email or Password",401));
    // In case of match
        const isPassMatched = await user.comparePass(password);

    // In case of no match
    if(!isPassMatched)
        return next(new ErrorHander("Invalid Email or Password",401));
    
        sendToken(user,200,res);
});

// User Logout
exports.logout = catchAsyncError(async(req,res,next)=>{

    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })

    res.status(200).json({
        success:true,
        message:"Logged Out Successfully",
    });
});