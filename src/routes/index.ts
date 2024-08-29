import { Router } from 'express';
import userRouter from './user.router';
import authRouter from './auth.route';
import taskRouter from './task.route';
import categoryRouter from './category.route';
import taskCategoryRouter from './taskCategory.route';

const appRouter = Router();
appRouter.use('/user', userRouter);
appRouter.use('/auth', authRouter);
appRouter.use('/user', taskRouter);
appRouter.use('/user', categoryRouter);
appRouter.use('/user', taskCategoryRouter);

export default appRouter;
