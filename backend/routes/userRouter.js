import express from "express"
import {register,login,pictureUpload,updateUserProfile,getUserAndProfile,updateUserData, getAllProfiles, downloadProfile, acceptConnectionRequest, findMyConnections, whatAreMyConnetions, sendConnectionRequest, getUserProfileAndUsername} from "../controllers/userController.js"
import { checkToken } from "../middlewares/token.js"
import multer from 'multer'

const userRouter = express.Router();


const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/');
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname);
    }
})

const upload = multer({storage:storage});

userRouter.route("/register")
.post(register);

userRouter.route("/login")
.post(login);

userRouter.route("/updateProfile_picture")
.post(upload.single('profile_picture'),pictureUpload);


userRouter.route("/updateUser_profile")
.post(updateUserProfile);

userRouter.route("/get_user_and_profile")
.get(getUserAndProfile);

userRouter.route("/update_profile_data")
.post(updateUserData);

userRouter.route("/user/get_all_users")
.get(getAllProfiles);

userRouter.route("/user/download_profile")
.get(downloadProfile);


userRouter.route("/user/send_connection_request")
.post(sendConnectionRequest);

userRouter.route("/user/get_connection_request")
.get(findMyConnections);

userRouter.route("/user/my_connection_request")
.get(whatAreMyConnetions);

userRouter.route("/user/accept_connection_request")
.post(acceptConnectionRequest);

userRouter.route("/user/get_profile")
.get(getUserProfileAndUsername);



export default userRouter;