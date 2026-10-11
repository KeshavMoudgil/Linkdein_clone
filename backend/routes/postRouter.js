import express from 'express';
import multer from 'multer';
import { createComment, createPost, deleteComment_of_user, deletePost, get_commentBy_posts, getAllPosts, incrimetLikes } from '../controllers/postController.js';

const postRouter = express.Router();

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/');
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname);
    }
})

const upload = multer({storage:storage});


postRouter.route("/post").post(upload.single('media'),createPost);

postRouter.route("/posts").get(getAllPosts);
postRouter.route("/delete_post").delete(deletePost);
postRouter.route("/comment_post").post(createComment);
postRouter.route("/get_comments").get(get_commentBy_posts);
postRouter.route("/delete_comment").delete(deleteComment_of_user);
postRouter.route("/incriment_likes").post(incrimetLikes);


export default postRouter;