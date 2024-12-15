import { Router } from 'express'
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory
} from '../controllers/category.controller'
import { authenticateToken } from '../middleware/authentication'

const categoryRouter = Router()

categoryRouter.post('/category', authenticateToken, createCategory)

categoryRouter.get('/category', authenticateToken, getAllCategories)

categoryRouter.get('/category/:categoryId', authenticateToken, getCategoryById)

categoryRouter.put('/category/:categoryId', authenticateToken, updateCategory)

categoryRouter.delete(
  '/category/:categoryId',
  authenticateToken,
  deleteCategory
)

export default categoryRouter
