import express from "express";
import { allUsers, userById, getUser, updateUser, deleteUser } from "../controllers/user.controller";
import { requireSignIn } from "../controllers/auth";
const router = express.Router();

router.get('/users', allUsers );
router.get('/user/:userId', requireSignIn, getUser);
router.put('/user/:userId', requireSignIn, updateUser);
router.delete('/user/:userId', requireSignIn, deleteUser);

router.param("userId", userById);

export default router;