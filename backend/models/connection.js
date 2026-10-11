import mongoose from "mongoose";

let connectionSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    connectionId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    status_accepted:{
        type:Boolean,
        default:null,
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
    
})

const Connection = new mongoose.model("Connection",connectionSchema);

export default Connection;