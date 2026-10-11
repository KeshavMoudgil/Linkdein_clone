import mongoose from "mongoose";
//import { stringAt } from "pdfkit/js/data";

let userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    active:{
        type:Boolean,
        default:true,
    },
    profilePicture:{
        type:String,
        default:"default.jpeg"

    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },
    token:{
        type:String,
        default:''
    }
})

const User = new mongoose.model("User",userSchema);

export default User;