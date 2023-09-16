const ErrorHandler = require("../utils/errhandler");
const catchAsyncErros = require("../middleware/catchAsyncErrors");
const User = require('../models/userModel');
const sendToken = require("../utils/jwtToken");
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const cloudinary = require('cloudinary');

//Register a User
exports.registerUser = catchAsyncErros(async (req, res, next) => {

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder: "avatars",
        width: 150, 
        crop: "scale"
    })

    const{name, email, password} = req.body;
    const user = await User.create({
        name, 
        email, 
        password,
        avatar: {
            public_id: myCloud.public_id, 
            url: myCloud.secure_url
        }
    })

    sendToken(user,201, res);
})  


// Login User
exports.loginUser = catchAsyncErros(async (req, res, next) => {
    const {email, password} = req.body; 

    // checking if user has given password and email both 
    if(!email || !password){
        return next(new ErrorHandler("Please Enter email and password",400));
    }

    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid Email or password", 401));
    }

    const isPasswordMatch = user.comparePassword(password);

    if(!isPasswordMatch){
        return next(new ErrorHandler("Invalid Email or password", 401));
    }

    sendToken(user,200, res);

})


// Logout User
exports.logout = catchAsyncErros(async (req, res, next) => {

    res.cookie('token', null,{
        expires: new Date(Date.now()),
        httpOnly: true
    })


    res.status(200).json({
        success: true, 
        message: "Logged Out"
    })
})


// Forgot Password
exports.forgotPassword = catchAsyncErros(async (req, res, next) => {
    const user = await User.findOne({email: req.body.email});
    
    if(!user){
        return next(new ErrorHandler("User not found", 404));
    }

    // Get ResetPassword Token 
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave: false});

    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
    const message = `Your password reset token is:- \n\n ${resetPasswordUrl} \n\nIf you have not requested  this email then please ignore it`;

    try {
        await sendEmail({
            email: user.email, 
            subject: `Ecommerce Password Recover`,
            message,
        })
        res.status(200).json({
            success: true, 
            message: `Email send to ${user.email} successfully`
        })


    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined; 

        await user.save({validateBeforeSave: false});

        return next(new ErrorHandler(error.message, 500))
    }

})


// Reset Password
exports.resetPassword = catchAsyncErros(async (req, res, next) => {
    // creating token hash
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex"); 

    const user = await User.findOne({
        resetPasswordToken, 
        resetPasswordExpire: {$gt: Date.now()},
    });

    if(!user){
        return next(new ErrorHandler("Reset Password Token is Invalid or has been expired", 400));
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("password doesn't match", 400));
    }

    user.password = req.body.password; 
    user.resetPasswordToken = undefined; 
    user.resetPasswordExpire = undefined;
    
    await user.save();

    sendToken(user,200, res);
})


// Get User Details
exports.getUserDetails  = catchAsyncErros(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true, 
        user,
    })



})

// update user Password 
exports.updatepassword = catchAsyncErros(async(req, res, next) => {
    console.log(req)
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatch = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatch){
        return next(new ErrorHandler("Old password is Incorrect", 401));
    }
    
    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("password doesn't match", 400));        
    }

    user.password  = req.body.newPassword;
    await user.save();

    sendToken(user, 200, res);
})

// update User Profile
exports.updateProfile = catchAsyncErros(async (req, res, next) => {
    
    const newUserData = {
        name: req.body.name, 
        email: req.body.email, 
    }
    console.log(req)

    // We will add cloudinary later 
    if(req.body.avatar !== ""){
        const user = await User.findById(req.user.id);
        const imageId = user.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId);
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
            folder: "avatars",
            width: 150, 
            crop: "scale"
        })

        newUserData.avatar = {
            public_id: myCloud.public_id, 
            url:myCloud.secure_url,
        }
    }




    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true, 
        runValidators: true, 
        useFindAndModify: false
    })


    res.status(200).json({
        success: true,
    })
})

// get All User (admin)
exports.getAllUsers = catchAsyncErros(async (req, res, next) => {
    const users = await User.find();
    console.log(users)

    res.status(200).json({
        success: true, 
        users
    })
  
})


// get Single User (admin)
exports.getSingleUser = catchAsyncErros(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler('user does not exist with Id'))
    }

    res.status(200).json({
        success: true, 
        user 
    })
  
})

// update User Role -- Admin
exports.updateUserRole = catchAsyncErros(async (req, res, next) => {
  
    const newUserData = {
        name: req.body.name, 
        email: req.body.email, 
        role: req.body.role
    }


    await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true, 
        runValidators: true, 
        useFindAndModify: false
    })


    

    res.status(200).json({
        success: true,
    })
})

// Delete User
exports.deleteUser = catchAsyncErros(async (req, res, next) => {
  
    const user = await User.findByIdAndDelete(req.params.id);

    if(!user){
        return next(new ErrorHandler(`user does not exist with id ${req.params.id}`));
    }

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);
    // await user.remove();


    res.status(200).json({
        success: true,
        message: `user deleted successfully`
    })
})