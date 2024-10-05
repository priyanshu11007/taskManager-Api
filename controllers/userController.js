const User = require('./../models/userModel');
const express= require('express');
const jwt = require('jsonwebtoken');

const JWT_SECRET = "piyanshu-vvrs-rohit-priyadarshi";
const JWT_EXPIRES_IN = '90d';
const JWT_COOKIE_EXPIRES_IN = 90;

const signToken = (id) => {
    return jwt.sign({ id: id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
};

exports.signup = async(req,res,next)=>{
    try{
    const user = await User.create(req.body);
    const token= signToken(user._id);
    res.cookie('jwt',token,{
    expires: new Date(
        Date.now()+ JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly:true
    });
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    delete userWithoutPassword.__v;
    res.status(201).json({
        status:"created",
        token:token,
        data:user
    });
}catch(err){
    res.status(400).json({
        error: err.message
    })
}
}
exports.login = async(req,res,next)=>{
    try{
        const {email,password}=req.body;
        if(!email || ! password){
            res.status(400).json({
                message:"provide email and password"
            })
        }
        const user = await User.findOne({email:email}).select('+password');
        const passCorrect = await user.correctPassword(password,user.password);
        if(!user || !passCorrect ){
            res.status(400).json({
                message:"provide correct email or password"
            })
        }
        const token = signToken(user._id);
        res.cookie('jwt',token, {
            expires: new Date(
                Date.now() + JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
            ),
            httpOnly:true
        });

        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;
        delete userWithoutPassword.__v;

        res.status(200).json({
            status:"success",
            token: token,
            data: userWithoutPassword
        });
        next();

    }catch(err){
        res.status(400).json({
            error: err.message
        })
        next();
    }
}

exports.protect = async (req, res, next) => {
    // 1) getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } 
    if (!token) {
      res.status(401).json({
        message:"You are not logged in"
      })
    }
    // 2) Token Verification
    const decoded = await jwt.verify(token, JWT_SECRET);

  
    // 3)check if user still exists
    const freshUser = await User.findById(decoded.id);
   
    if (!freshUser) {
      res.status(401).json({
        message:"user does not exist"
      })
    }
    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = freshUser;
    res.locals.user=freshUser;
    next();
  };
