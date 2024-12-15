import { Router } from 'express'
import {
  createTaskCategory,
  deleteTaskCategory,
  getCategoriesByTaskId,
  getTasksAndCategoriesByUser,
  getTasksByCategoryId,
  updateTaskCategory
} from '../controllers/taskCategory.controller'
import { authenticateToken } from '../middleware/authentication'

const taskCategoryRouter = Router()

taskCategoryRouter.get(
  '/task-categories',
  authenticateToken,
  getTasksAndCategoriesByUser
)

taskCategoryRouter.post(
  '/task-categories',
  authenticateToken,
  createTaskCategory
)

taskCategoryRouter.delete(
  '/task-categories/:id',
  authenticateToken,
  deleteTaskCategory
)

taskCategoryRouter.put(
  '/task-categories/:id',
  authenticateToken,
  updateTaskCategory
)

taskCategoryRouter.get(
  '/:taskId/categories',
  authenticateToken,
  getCategoriesByTaskId
)

taskCategoryRouter.get(
  '/:categoryId/tasks',
  authenticateToken,
  getTasksByCategoryId
)

export default taskCategoryRouter
