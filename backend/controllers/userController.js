import Profile from "../models/profie.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import PDFDocument from 'pdfkit'
import fs from "fs"
import Connection from "../models/connection.js";

const convetDataToPdf = async (data)=>{

  const doc = new PDFDocument();
  let outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
  let stream = fs.createWriteStream("uploads/" + outputPath);

  doc.pipe(stream);
  doc.image(`uploads/${data.userId.profilePicture}`,{align:"center",width:100})
  
  doc.fontSize(14).text(`Name:${data.userId.name}`);
  doc.fontSize(14).text(`username:${data.userId.username}`);
  doc.fontSize(14).text(`Email:${data.userId.email}`);
  doc.fontSize(14).text(`bio:${data.bio}`);
  doc.fontSize(14).text(`curr Position:${data.currPosition}`);

  doc.fontSize(14).text("Past Work : ");
  data.pastWork.forEach((index,work)=>{
    doc.fontSize(14).text(`Company Name:${work.company}`);
    doc.fontSize(14).text(`Position:${work.position}`);
    doc.fontSize(14).text(`Experience:${work.years}`);

  })

  doc.end();
  return outputPath;

}

export const register = async (req,res)=>{
      try {
        const {name,username,password,email} = req.body;
        if(!name || !username || !password || !email){
            return res.status(400).json({message:"All Feilds Required"})
        }

       let existingUser = await User.findOne({username});
    if(existingUser){
        return  res.status(302).json({message:"User already Exsists"});
    }


        let newPassWord = await bcrypt.hash(password,12);
      let user = await new User({
        name:name,
        username:username,
        password:newPassWord,
        email:email})
     await user.save();

      const profile = new Profile({userId:user._id})
      profile.save();
      res.status(201).json({message:"User Registerd Succesfully"});
      } catch (error) {
        res.status(500).json({message:error.message});
      }
}

export const login = async(req,res)=>{
    const {email,password} = req.body;

    let existingUser = await User.findOne({email});
    if(!existingUser){
        return  res.status(404).json({message:"User Cant't Exsists"});
    }

    let confirmPassword = await bcrypt.compare(password,existingUser.password);

    if(!confirmPassword){
      return  res.status(404).json({message:"Invalid Password"});
    }

    let token = crypto.randomBytes(32).toString("hex");
    await User.updateOne({_id:existingUser._id},{token});
    return res.json({token});
    
}

export const pictureUpload = async (req,res) => {
  const {token} = req.body; 
  
  try {
   let user =  await User.findOne({token:token});
   if(!user){
    return res.status(400).json({message:"Invalid Token"})
  }

  user.profilePicture = req.file.filename;
  await user.save();

  return res.status(201).json({message:"Profile Picture Updated Succesfully!!"})

    
  } catch (error) {
    return res.json({message:error.message})
  }

}

export const updateUserProfile = async (req,res) =>{
  try {
    let {token,...newUser} = req.body;
    
    const user = await User.findOne({token:token});
    if(!user) {
       return res.status(400).json({message:"Invalid Token"});
    }

    const {username,email} = newUser;

    let existingUser = await User.findOne({email});

    if(existingUser){
      if(existingUser && String(existingUser._id !== user._id)){
        return res.status(400).json({message:"User Already Exists!"});
      }
    }
    Object.assign(user,newUser);
    await user.save();
    return res.json({message:"User Info Updated"});
    
  } catch (error) {
    return res.status(500).json({message:error.message});
  }

}


export const getUserAndProfile = async (req,res) =>{
  try {
    const {token} = req.query;
    
    let user = await User.findOne({token:token})
    if(!user){
    return res.status(400).json({message:"Invalid Token"})
  }
    const userProfile = await Profile.findOne({userId:user._id})
    .populate('userId','name username email profilePicture');

    return res.json({userProfile});
    
  } catch (error) {
    return res.status(500).json({message:error.message});
  }

}

export const updateUserData = async(req,res) =>{
  try {

    const {token , ...data} = req.body;
    
    let user = await User.findOne({token:token});
    if(!user){
      return res.status(401).json({message:"User Can't Exists"});
    }

    const profile = await Profile.findOne({userId:user._id})
    Object.assign(profile,data)
    await profile.save();
    return res.json({"profile":profile})
    
    
  } catch (error) {
    return res.status(500).json({message:error.message})
  }
}

export const getAllProfiles = async(req,res) =>{
  try {

    let profile = await Profile.find({}).populate('userId',' name username email profilePicture');
    return res.json({profile});
    
  } catch (error) {
     return res.status(500).json({message:error.message})
  }
}

export const downloadProfile = async(req,res) =>{
  let user_id = req.query.id
  const profile = await Profile.findOne({userId:user_id})
  .populate('userId','name username email profilePicture');

  let file = await convetDataToPdf(profile)

 return  res.json({"message":file});
}

export const findMyConnections = async(req,res) =>{
  try {

    const {token } = req.query;
    
    let user = await User.findOne({token:token});
    if(!user){
      return res.status(404).json({message:"User Can't Exists"});
    }

    let connections = await Connection.find({userId:user._id})
    .populate('connectionId','name email username profilePicture');

    return res.json(connections);

  } catch (error) {
    return res.status(500).json({message:error.message})
  }
}

export const sendConnectionRequest = async (req,res) =>{
  const {token,connectionId} = req.body;

  try {

    let user = await User.findOne({token:token});
    if(!user){
      return res.status(404).json({message:"User Can't Exists"});
    }

    let connectUser = await User.findOne({id:connectionId});

    if(!connectUser){
      return res.status(404).json({message:" ConnectUser Can't Exists"});
    }

    let existingUser = await Connection.findOne({
      userId:user._id,
      connectionId : connectUser._id
    })

    if(existingUser){
      return res.status(404).json({message:" Connection Requests Already send"});
   
    }

    let request = new Connection({
      userId:user._id,
      connectionId : connectUser._id
    })
    await request.save();

   return res.status(201).json({message:" Requests send"});
    
  } catch (error) {
    return res.status(500).json({message:error.message})
  }
}

export const whatAreMyConnetions = async(req,res) =>{
  try {

    const {token } = req.query;
    
    let user = await User.findOne({token:token});
    if(!user){
      return res.status(404).json({message:"User Can't Exists"});
    }

    let connections = await Connection.find({connectionId:user._id})
    .populate('userId','name email username profilePicture');

    return res.json(connections);

  } catch (error) {
    return res.status(500).json({message:error.message})
  }
}

export const acceptConnectionRequest = async (req,res) =>{
  const {token,requsetId,action_type} = req.body

  let user = await User.findOne({token:token});
    if(!user){
      return res.status(404).json({message:"User Can't Exists"});
    }

    let connection = await Connection.findOne({_id:requsetId});

    if(!connection){
      return res.status(404).json({message:"User Can't Exists"});
    }

    if(action_type === true) {
      connection.status_accepted = true;
    }else{
      connection.status_accepted = false;

    }

    await connection.save();
    return res.status(201).json({message:"Connection Accepted Send!!"})

}

export const getUserProfileAndUsername = async (req,res)=>{
   let {username} = req.query;

   try {
    let user = await User.findOne({username});
    if(!user){
      return res.status(404).json({message:"User Not Exists"})
    }

    const userProfile = await Profile.findOne({userId:user._id}).populate('userId','name username email profilePicture');

    return res.status(201).json({"profile":userProfile})
   } catch (error) {
    return res.status(500).json({message:error.message});
   }
}
