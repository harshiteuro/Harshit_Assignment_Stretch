const {validationResult, body}=require('express-validator');
// const bcrypt=require('bcryptjs');
const crypto = require('crypto');

const jwt=require('jsonwebtoken');

const HttpError =require('../models/http-error');
const User=require('../models/user');

const deleteProfile=async (req,res)=>{
    const userId = req.params.id
    User.findOneAndRemove({ _id: userId }, (err, result) => {
        if (err) {
          // Handle the error, e.g., send an error response
          res.status(500).json({response:'Error deleting user.'});
        } else if (!result) {
          // Handle the case where the user was not found
          res.status(404).json({response:'User not found.'});
        } else {
          // User successfully deleted
          res.status(200).json({response:'User deleted successfully.'});
        }
    });
}

const getUserByToken=async (req,res,next)=>{

    const userId = req.params.id
    let user;
    try{
        user=await User.find({ _id: userId })
    }catch(err){
        const error=new HttpError('Fetching users failed, please try again. ',500);
    } 
    // return res.json({user});
    res.json({user:user.map(user=>user.toObject({getters:true}))});
}

const getUsers = async (req, res, next) => {
    const { sort, search } = req.body;
    let users;
    try {
      let query = {};
  
      if (search) {
        // If a search term is provided, create a query based on the 'sort' field
        if (sort === 'name') {
          query.name = { $regex: search, $options: 'i' };
        } else if (sort === 'techstack') {
          query.techstack = { $regex: search, $options: 'i' };
        } else if (sort === 'bio') {
          query.bio = { $regex: search, $options: 'i' }; 
        }
  
        // Find users based on the query
        users = await User.find(query, '-password');
      } else {
        // If no search term is provided, retrieve all users
        users = await User.find({}, '-password');
      }
    } catch (err) {
      const error = new HttpError('Fetching users failed, please try again.', 500);
      return next(error);
    }
  
    res.json({ users: users.map((user) => user.toObject({ getters: true })) });
  };
  

const update= async (req,res,next)=>{
    const {id,name,email,password,bio,github,website,seeking,techstack,fieldofinterest}=req.body;
    
    
     const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
     const updatedData = {
      name: name,
      password: hashedPassword,
      image:req.file.path,
      bio: bio,
      github: github,
      website: website,
      seeking: seeking,
      techstack: techstack,
      email: email,
      fieldofinterest:fieldofinterest
    };
    let updatedUser;
    try{
        updatedUser = await User.findByIdAndUpdate(
            id,
            updatedData,
            { new: true } // This option returns the updated document
          );    
    }
    catch(err){
        const error=new HttpError(
            'Update failed, please try again',
            500
        );
        return next(error);
    }
    res.status(201).json({updatedUser:updatedUser});

}

const signup= async (req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return next(new HttpError('Invalid inputs passed, please check your data',422));
    }
    const {name,email,password,bio,github,website,seeking,techstack,fieldofinterest}=req.body;

    let existingUser;
    try{
        existingUser=await User.findOne({email:email});
    }catch(err){
        const error=new HttpError('Signing up failed, Please try again',500);
        return next(error);
    }

    if(existingUser){
        const error=new HttpError('User Already exits, Please login instead.',422);
        return next(error);
    }

    let hashedPassword;
    try{
        hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    }
    catch(err){
        const error=new HttpError('Could not create user, please try again',500);
        return next(error);
    }   

    const createdUser=new User({
        name,
        email,
        image:req.file.path,
        password:hashedPassword,
        places:[],
        bio,
        github,
        website,
        seeking,
        techstack,
        fieldofinterest
    });
    // DUMMY_USERS.push(createdUser);
    try{
        await createdUser.save();
    }
    catch(err){
        const error=new HttpError(
            'Signup failed, please try again',
            500
        );
        return next(error);
    }
   
    let token;
    try{
        token=jwt.sign({userId:createdUser.id,email:createdUser.email},process.env.JWT_KEY,{expiresIn:'1h'});

    }catch(err){
        const error=new HttpError(
            'Signup failed, please try again',
            500
        );
        return next(error);
    }

    res.status(201).json({userId:createdUser.id,email:createdUser.email,token:token, bio,github,website,seeking,techstack});
}

const login=async (req,res,next)=>{
    const {email,password}=req.body;
    let existingUser;
    try{
        existingUser=await User.findOne({email:email});
    }catch(err){
        const error=new HttpError('Loging in failed, Please try again.',500);
        return next(error);
    }

    if(!existingUser){
        const error=new HttpError('Invalid credentials, could not log you in.',403);
        return next(error);
    }
    let isValidPassword=false;
    try{
        // hashedPassword=await bcrypt.hash(password,12);
        hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        if(hashedPassword===existingUser.password){
            isValidPassword=true
        }
        
    }
    catch(err){
        const error=new HttpError('Invalid credentials, could not log you in.',403);
        return next(error);
    }

    if(!isValidPassword){
        const error=new HttpError('Invalid credentials, could not log you in.',403);
        return next(error);
    }
    
    let token;
    try{
        token=jwt.sign({userId:existingUser.id,email:existingUser.email},process.env.JWT_KEY,{expiresIn:'1h'});

    }catch(err){
        const error=new HttpError(
            'Login failed, please try again',
            500
        );
        return next(error);
    }

    res.json({userId:existingUser.id,email:existingUser.email,token:token});
}

exports.getUsers=getUsers;
exports.signup=signup;
exports.login=login;
exports.getUserByToken=getUserByToken;
exports.update=update;
exports.deleteProfile=deleteProfile;
