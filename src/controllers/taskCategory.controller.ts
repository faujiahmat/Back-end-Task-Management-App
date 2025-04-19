import prisma from '../db'
import { NextFunction, Response } from 'express'
import { CustomRequest } from '../middleware/authentication'

export const getTasksAndCategoriesByUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.user?.id // Mengambil userId dari token/session yang sudah terautentikasi

  if (!userId) {
    res.status(401).json({
      statusCode: 401,
      message: 'User not authenticated',
      data: null,
      error: 'forbidden'
    })
    return
  }

  try {
    // Query untuk mendapatkan task title dan category name berdasarkan userId
    const tasksWithCategories = await prisma.task.findMany({
      where: {
        userId: userId // Pastikan menggunakan userId untuk filter task milik user
      },
      select: {
        title: true, // Ambil title task
        categories: {
          select: {
            category: {
              select: {
                name: true // Ambil name dari kategori
              }
            }
          }
        }
      }
    })

    // Map hasil query agar struktur lebih sederhana
    const result = tasksWithCategories.map((task) => ({
      taskTitle: task.title,
      categories: task.categories.map((cat) => cat.category.name)
    }))

    res.status(200).json({
      statusCode: 200,
      message: 'request success',
      data: result,
      error: null
    })
  } catch (error: Error | any) {
    next(
      new Error(
        'Error at src/controllers/taskCategory.controller.ts:getTasksAndCategoriesByUser: getTasksAndCategoriesByUser => ' +
          error.message
      )
    )
  }
}

export const createTaskCategory = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.user?.id // Mengambil userId dari token/session yang sudah terautentikasi

  if (!userId) {
    res.status(401).json({
      statusCode: 401,
      message: 'User not authenticated',
      data: null,
      error: 'forbidden'
    })
    return
  }

  const { taskId, categoryId } = req.body

  if (!taskId || !categoryId) {
    res.status(400).json({
      statusCode: 400,
      message: 'Task ID and Category ID are required',
      data: null,
      error: 'Unauthorized'
    })
    return
  }

  try {
    // Cek apakah task dan category dimiliki oleh user yang sama
    const task = await prisma.task.findFirst({
      where: { id: taskId, userId: userId }
    })

    const category = await prisma.category.findFirst({
      where: { id: categoryId, userId: userId }
    })

    if (!task || !category) {
      res.status(404).json({
        statusCode: 404,
        message: 'Task or Category not found for this user',
        data: null,
        error: 'Not found'
      })
      return
    }

    // Buat TaskCategory baru
    const taskCategory = await prisma.taskCategory.create({
      data: {
        taskId: Number(taskId),
        categoryId: Number(categoryId)
      }
    })

    res.status(201).json({
      statusCode: 201,
      message: 'TaskCategory created successfully',
      data: taskCategory,
      error: null
    })
  } catch (error: Error | any) {
    next(
      new Error(
        'Error at src/controllers/taskCategory.controller.ts: creareTaskCategory => ' +
          error.message
      )
    )
  }
}

export const getCategoriesByTaskId = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { taskId } = req.params

  try {
    // Query untuk mendapatkan kategori berdasarkan taskId
    const taskCategories = await prisma.taskCategory.findMany({
      where: {
        taskId: parseInt(taskId, 10)
      },
      include: {
        category: true, // Mengambil detail kategori
        task: true // Mengambil detail task
      }
    })

    // Jika task tidak ditemukan atau tidak memiliki kategori
    if (taskCategories.length === 0) {
      res.status(404).json({
        statusCode: 404,
        message: 'No categories found for this task',
        data: null,
        error: null
      })
      return
    }

    // Mengambil hanya nama kategori
    const categories = taskCategories.map((tc) => tc.category.name)

    const taskName = taskCategories[0].task.title

    res.status(200).json({
      statusCode: 200,
      message: 'Request success',
      data: {
        taskId,
        taskName,
        categories
      },
      error: null
    })
  } catch (error: Error | any) {
    next(
      new Error(
        'Error at src/controllers/taskCategory.controller.ts: getCategoriesByTaskId => ' +
          error.message
      )
    )
  }
}

export const getTasksByCategoryId = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { categoryId } = req.params

  try {
    // Query untuk mendapatkan task berdasarkan categoryId
    const taskCategories = await prisma.taskCategory.findMany({
      where: {
        categoryId: parseInt(categoryId, 10)
      },
      include: {
        task: true // Mengambil detail task
      }
    })

    // Jika kategori tidak memiliki task
    if (taskCategories.length === 0) {
      res.status(404).json({
        statusCode: 404,
        message: 'No tasks found for this category',
        data: null,
        error: 'Not found'
      })
      return
    }

    // Mengambil hanya judul task
    const tasks = taskCategories.map((tc) => ({
      taskId: tc.task.id,
      title: tc.task.title
    }))

    res.status(200).json({
      statusCode: 200,
      message: 'Task found successfully',
      data: {
        categoryId,
        tasks
      },
      error: null
    })
  } catch (error: Error | any) {
    next(
      new Error(
        'Error at src/controllers/taskCategory.controller.ts: getTaskByCategoryId => ' +
          error.message
      )
    )
  }
}

export const deleteTaskCategory = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params

  try {
    // Cek apakah taskCategory dengan ID yang diberikan ada
    const taskCategory = await prisma.taskCategory.findUnique({
      where: {
        id: parseInt(id, 10)
      }
    })

    if (!taskCategory) {
      res.status(404).json({
        statusCode: 404,
        message: 'TaskCategory not found',
        data: null,
        error: 'Not found'
      })
      return
    }

    // Hapus taskCategory berdasarkan ID
    const deletedTaskCategory = await prisma.taskCategory.delete({
      where: {
        id: parseInt(id, 10)
      }
    })

    res.status(200).json({
      statusCode: 200,
      message: 'TaskCategory deleted successfully',
      data: deletedTaskCategory,
      error: null
    })
  } catch (error: Error | any) {
    next(
      new Error(
        'Error at src/controller/taskCategory.controller.ts: deleteTaskCategory => ' +
          error.message
      )
    )
  }
}

export const updateTaskCategory = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params
  const { taskId, categoryId } = req.body

  try {
    // Cek apakah taskCategory dengan ID yang diberikan ada
    const taskCategory = await prisma.taskCategory.findUnique({
      where: {
        id: parseInt(id, 10)
      }
    })

    if (!taskCategory) {
      res.status(404).json({
        statusCode: 404,
        message: 'TaskCategory not found',
        data: null,
        error: 'Not found'
      })
      return
    }

    // Update taskCategory berdasarkan ID
    const updatedTaskCategory = await prisma.taskCategory.update({
      where: {
        id: parseInt(id, 10)
      },
      data: {
        taskId: taskId ? parseInt(taskId, 10) : undefined,
        categoryId: categoryId ? parseInt(categoryId, 10) : undefined
      }
    })

    res.status(200).json({
      statusCode: 200,
      message: 'TaskCategory updated successfully',
      data: updatedTaskCategory,
      error: null
    })
  } catch (error: Error | any) {
    next(
      new Error(
        'Error at src/controllers/taskCategory.controller.ts: updateTaskCategory => ' +
          error.message
      )
    )
  }
}
