const ErrorHander = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

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

// Forgot Password
exports.forgotPassword = catchAsyncError(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHander("User Not Found",404));
    }

    // Get Reset Password Token
    const resetToken = user.getResetPassToken();
    // Saving reset token in user before proceeding
    await user.save({validateBeforeSave: false});

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl}\n\nIf you have not requested this email then, plesae ignore this mail`;

    try{
        await sendEmail({
            email:user.email,
            subject:`Ecommerce Password Recovery`,
            message,
        });;

        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`
        })
    }
    catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave: false});

        return next(new ErrorHander(error.message,404));
    }
});

// Reset Password
exports.resetPassword = catchAsyncError(async(req,res,next)=>{

    // Creating token Hash
    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt: Date.now()},
    });

    if(!user){
        return next(new ErrorHander("Reset password token is either invalid or expired",400));
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHander("Password does not match",400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user,200,res);

});