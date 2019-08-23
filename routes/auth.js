import express from "express";
import { signUp, signIn, signOut } from "../controllers/auth";
import { userById } from "../controllers/user.controller";
import { userSignupValidation } from '../validator';
const router = express.Router();

router.post('/signup', userSignupValidation, signUp );
router.post('/signin', signIn);
router.get('/signout', signOut);

//any route containing userId, our app would first exec userById()
router.param("userId", userById );


export default router;