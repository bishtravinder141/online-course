const User=require("../models/userModel")
const catchAsyncErrors = require("../middleware/catchAsyncError");
const sendToken = require("../utils/jwtToken");
const ErrorHandler = require("../utils/errorHandler");

const registerUser = catchAsyncErrors(async (req, res, next) => {
  
    const { name, email, password,address } = req.body;
    let user = await User.findOne({ email });
    if (user) {
     res.status(400)
        .json({ success: false, message: "User already exists" });
    }
  
     user = await User.create({
      name,
      email,
      password,
      address,
      avatar: {
        public_id:"temp_id",
        url: "temp_url",
      },
    });
  
    sendToken(res, user, "You are registered Succesfully", 201);
  });

// Login User
const loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password,address } = req.body;
  
    // checking if user has given password and email both
  
    if (!email || !password) {
      return next(new ErrorHandler("Please Enter Email & Password", 400));
    }

  
    const user = await User.findOne({ email }).select("+password");
  
    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }
  
    const isPasswordMatched = await user.comparePassword(password);
  
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }
  
    sendToken(res, user, "You are loggedIn Succesfully", 201);
  });

  const updateProfile = catchAsyncErrors(async (req, res, next) => {
    const {name, email, password,address } = req.body;

    const user=await User.findById(req.user.id);
      if(name){
        user.name=name
      }   
      if(email){
        user.email=email
      }
      if(password){
        user.password=password
      }

      await user.save();
      res.status(200).json({
        success: true,
        message: "Profile Updated",
       }) 
  });
  


  const followUser=catchAsyncErrors(async(req,res,next)=>{

    const userToFollow=await User.findById(req.params.id);
    const loggedInUser=await User.findById(req.user.id);

    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (loggedInUser.following.includes(userToFollow._id)) {
      const indexfollowing = loggedInUser.following.indexOf(userToFollow._id);
      const indexfollowers = userToFollow.followers.indexOf(loggedInUser._id);

      loggedInUser.following.splice(indexfollowing, 1);
      userToFollow.followers.splice(indexfollowers, 1);

      await loggedInUser.save();
      await userToFollow.save();

      res.status(200).json({
        success: true,
        message: "User Unfollowed",
      });
    } else {
      loggedInUser.following.push(userToFollow._id);
      userToFollow.followers.push(loggedInUser._id);

      await loggedInUser.save();
      await userToFollow.save();

      res.status(200).json({
        success: true,
        message: "User followed",
      });
    }
  })


  module.exports={registerUser,loginUser,updateProfile,followUser}