import mongoose from "mongoose";
//import { stringAt } from "pdfkit/js/data";

let postSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User" 
    },
    body:{
        type:String,
        required:true
    },
    likes:{
        type:Number,
        default: 0,
    },
    createdAt:{
        type:Date,
        default: Date.now(),
       
    },
    updatedAt:{
        type:Date,
        default: Date.now(),
        
    },
    active:{
        type:Boolean,
        default:true
    },
    fileType:{
        type:String,
        default:" "
    }
    
})

const Post = new mongoose.model("Post",postSchema);

export default Post;