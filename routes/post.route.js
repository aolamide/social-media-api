import express from "express";
import { getPosts, createPost, postsByUser, postById,isPoster, deletePost, updatePost } from "../controllers/post.controller";
import { userById } from "../controllers/user.controller";
import { requireSignIn } from "../controllers/auth";
import { createPostValidator } from '../validator';
const router = express.Router();

router.get('/posts', getPosts );
router.post(
    '/post/new/:userId', 
    requireSignIn,  
    createPost,
    createPostValidator
);
router.get('/posts/by/:userId', requireSignIn, postsByUser);
router.delete('/post/:postId', requireSignIn, isPoster, deletePost)
router.put('/post/:postId', requireSignIn, isPoster, updatePost)

//any route containing userId, our app would first exec userById()
router.param("userId", userById );

//any route containing postId, our app would first exec userById()
router.param("postId", postById );

export default router;