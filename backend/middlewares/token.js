import User from "../models/user.js"
export const checkToken = async(req,res) =>{
    try {
        let {token} = req.body;
        let existingToken = await User.findOne({token:token})
        if(existingToken){
            return res.json({token})
        }
        

    } catch (error) {
        return res.status(500).json({message:"User Cant't Exists"})
    }
}