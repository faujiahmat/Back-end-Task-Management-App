import express from 'express';
import { login, register } from '../controllers/auth.controller';
import { registerValidator } from '../middleware/validator';

const authRouter = express.Router();

authRouter.post('/login', login);

authRouter.post('/register', registerValidator, register);

export default authRouter;
