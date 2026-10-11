import Post from "../models/post.js"
import User from "../models/user.js"
import Comment from "../models/comment.js";

export const createPost = async(req,res) =>{
    let {token} = req.body;
    try {
        let user = await User.findOne({token:token});
    if(!user){
        return res.status(400).json({message:"user Can't Exsists"});
    }

    let post = new Post({
        userId:user._id,
        body :req.body.body,
        media: req.file !== undefined ? req.file.filename:"",
        fileType: req.file !== undefined ? req.file.mimetype.split("/")[1]:""
    });

    await post.save();
    return res.status(201).json({message:"Post Created Succesfully!!!"});
        
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

export const getAllPosts = async(req,res) =>{
    // let {token} = req.body;
    try {

    // let user = await User.findOne({token:token});

    // if(!user){
    //     return res.status(400).json({message:"user Cant Found"});
    // }

    let posts = await Post.find({}).populate('userId','name username email profilePicture')
        return res.json({posts});
    } catch (error) {
        return res.status(500).json({message:error.message});
        
    }

}

export const createComment = async(req,res) =>{
    let {token,commentBody,post_id} = req.body
    try {
        let user = await User.findOne({token:token});
    if(!user){
        return res.status(400).json({message:"user Can't Exsists"});
    }


    let post = await Post.findOne({_id:post_id});
    if(!post){
        return res.status(400).json({message:"post Can't Exsists"});
    }

    let comment = new Comment({
        userId:user._id,
        postId:post._id,
        body:commentBody
    })

    comment.save();
   
 return res.status(201).json({message:"Comment Added"});

        
    } catch (error) {
        return res.status(500).json({message:error.message});
        
    }

}

export const deletePost = async(req,res) =>{
    const {post_id,token } = req.body;

   let user = await User
   .findOne({token:token})
   .select("_id");

    if(!user){
        return res.status(400).json({message:"user Cant Found"});
    }

    let post = await Post.findOne({_id:post_id});

    if(!post){
        return res.status(400).json({message:"Posts Cant Found"});
    }

    if(post.userId.toString() !== user._id.toString()){
    
        return res.json({message:"Unathorized Access, InValid User !!!"});
    
    }

    await Post.deleteOne({_id:post_id});

    return res.json({message:"Post Deleted Successfully !!"});
    
}

export const get_commentBy_posts = async(req,res) =>{
    let {post_id} = req.query;

 try {
       let post = await Post.findOne({_id:post_id});

    if(!post){
        return res.status(400).json({message:"Posts Cant Found"});
    }

    let comments = await Comment.find({postId:post_id}).populate("userId","username name")

     return res.json(comments.reverse());
    
 } catch (error) {
    return res.status(500).json({message:error.message});
 }
}

export const deleteComment_of_user = async(req,res) =>{
    let {token,commentId} = req.body;
    try {

        let user = await User
        .findOne({token:token})
        .select("_id");
        
        if(!user){
        return res.status(400).json({message:"User Cant Found"});
        }

        let comment =  await Comment.findOne({_id:commentId});

        if(!comment){
        return res.status(400).json({message:"Comment Cant Found"});
       }

       if(comment.userId.toString() !== user._id.toString()){
        return res.json({message:"Unathorized Access, InValid User !!!"});
       }

       await Comment.deleteOne({_id:commentId});

       return res.json({message:"Comment Deleted Successfully !!"});

       
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}


export const incrimetLikes = async(req,res) =>{
    let {post_id} = req.body;



    try {
        let post = await Post.findOne({_id:post_id})
        if(!post){
            return res.status(400).json({message:"can't find post"})
        }

        post.likes = post.likes + 1;
        await post.save();

        return res.status(201).json({message:"Likes Incremented Succesfully"})
        
    } catch (error) {
        return res.status(500).json({message:error.message});
    
    }
}