import express from 'express'
import {
  // assignCategoriesToTask,
  changeTaskStatus,
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  updateTask
} from '../controllers/task.controller'
import { authenticateToken } from '../middleware/authentication'

const taskRouter = express.Router()

taskRouter.post('/tasks', authenticateToken, createTask)

taskRouter.get('/tasks', authenticateToken, getAllTasks)

taskRouter.get('/tasks/:taskId', authenticateToken, getTaskById)

taskRouter.put('/tasks/:taskId', authenticateToken, updateTask)

taskRouter.delete('/tasks/:taskId', authenticateToken, deleteTask)

taskRouter.patch('/tasks/:taskId/status', authenticateToken, changeTaskStatus)

// taskRouter.post(
//   '/tasks/:taskId/category',
//   authenticateToken,
//   assignCategoriesToTask
// );

export default taskRouter
