import express from 'express';
import {
  deleteUser,
  getUserProfile,
  updateUserProfile,
  userControllerFindMany,
  // userControllerFindUnique,
} from '../controllers/user.controller';
import { authenticateToken } from '../middleware/authentication';
import { registerValidator } from '../middleware/validator';

const userRouter = express.Router();

userRouter.get('/', userControllerFindMany);


userRouter.get('/profile', authenticateToken, getUserProfile);

userRouter.put(
  '/profile',
  authenticateToken,
  registerValidator,
  updateUserProfile
);


userRouter.delete('/profile', authenticateToken, deleteUser);

export default userRouter;
