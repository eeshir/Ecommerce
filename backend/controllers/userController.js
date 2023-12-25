const ErrorHander = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncErrors");

const User = require("../models/userModel");

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

    res.status(201).json({
        success:true,
        user
    });
});