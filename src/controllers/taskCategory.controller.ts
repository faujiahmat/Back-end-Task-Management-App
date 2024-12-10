import prisma from '../db';
import { Response } from 'express';
import { CustomRequest } from '../middleware/authentication';

export const getTasksAndCategoriesByUser = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const userId = req.user?.id; // Mengambil userId dari token/session yang sudah terautentikasi

  if (!userId) {
    res.status(401).json({ error: 'User not authenticated' });
    return;
  }

  try {
    // Query untuk mendapatkan task title dan category name berdasarkan userId
    const tasksWithCategories = await prisma.task.findMany({
      where: {
        userId: userId, // Pastikan menggunakan userId untuk filter task milik user
      },
      select: {
        title: true, // Ambil title task
        categories: {
          select: {
            category: {
              select: {
                name: true, // Ambil name dari kategori
              },
            },
          },
        },
      },
    });

    // Map hasil query agar struktur lebih sederhana
    const result = tasksWithCategories.map((task) => ({
      taskTitle: task.title,
      categories: task.categories.map((cat) => cat.category.name),
    }));

    res.status(200).json({ data: result });
  } catch (error) {
    console.error('Error retrieving tasks and categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createTaskCategory = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const userId = req.user?.id; // Mengambil userId dari token/session yang sudah terautentikasi

  if (!userId) {
    res.status(401).json({ error: 'User not authenticated' });
    return;
  }

  const { taskId, categoryId } = req.body;

  if (!taskId || !categoryId) {
    res.status(400).json({ error: 'Task ID and Category ID are required' });
    return;
  }

  try {
    // Cek apakah task dan category dimiliki oleh user yang sama
    const task = await prisma.task.findFirst({
      where: { id: taskId, userId: userId },
    });

    const category = await prisma.category.findFirst({
      where: { id: categoryId, userId: userId },
    });

    if (!task || !category) {
      res
        .status(404)
        .json({ error: 'Task or Category not found for this user' });
      return;
    }

    // Buat TaskCategory baru
    const taskCategory = await prisma.taskCategory.create({
      data: {
        taskId: Number(taskId),
        categoryId: Number(categoryId),
        
      },
    });

    res.status(201).json({
      data: taskCategory,
    });
  } catch (error) {
    console.error('Error creating task category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCategoriesByTaskId = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;

  try {
    // Query untuk mendapatkan kategori berdasarkan taskId
    const taskCategories = await prisma.taskCategory.findMany({
      where: {
        taskId: parseInt(taskId, 10),
      },
      include: {
        category: true, // Mengambil detail kategori
        task: true, // Mengambil detail task
      },
    });

    // Jika task tidak ditemukan atau tidak memiliki kategori
    if (taskCategories.length === 0) {
      res.status(404).json({ error: 'No categories found for this task' });
      return;
    }

    // Mengambil hanya nama kategori
    const categories = taskCategories.map((tc) => tc.category.name);

    const taskName = taskCategories[0].task.title;

    res.json({ taskId, taskName, categories });
  } catch (error) {
    console.error('Error retrieving categories for task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTasksByCategoryId = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { categoryId } = req.params;

  try {
    // Query untuk mendapatkan task berdasarkan categoryId
    const taskCategories = await prisma.taskCategory.findMany({
      where: {
        categoryId: parseInt(categoryId, 10),
      },
      include: {
        task: true, // Mengambil detail task
      },
    });

    // Jika kategori tidak memiliki task
    if (taskCategories.length === 0) {
      res.status(404).json({ error: 'No tasks found for this category' });
      return;
    }

    // Mengambil hanya judul task
    const tasks = taskCategories.map((tc) => ({
      taskId: tc.task.id,
      title: tc.task.title,
    }));

    res.json({ categoryId, tasks });
  } catch (error) {
    console.error('Error retrieving tasks for category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteTaskCategory = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    // Cek apakah taskCategory dengan ID yang diberikan ada
    const taskCategory = await prisma.taskCategory.findUnique({
      where: {
        id: parseInt(id, 10),
      },
    });

    if (!taskCategory) {
      res.status(404).json({ error: 'TaskCategory not found' });
      return;
    }

    // Hapus taskCategory berdasarkan ID
    await prisma.taskCategory.delete({
      where: {
        id: parseInt(id, 10),
      },
    });

    res.status(200).json({ message: 'TaskCategory deleted successfully' });
  } catch (error) {
    console.error('Error deleting task category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateTaskCategory = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { taskId, categoryId } = req.body;

  try {
    // Cek apakah taskCategory dengan ID yang diberikan ada
    const taskCategory = await prisma.taskCategory.findUnique({
      where: {
        id: parseInt(id, 10),
      },
    });

    if (!taskCategory) {
      res.status(404).json({ error: 'TaskCategory not found' });
      return;
    }

    // Update taskCategory berdasarkan ID
    const updatedTaskCategory = await prisma.taskCategory.update({
      where: {
        id: parseInt(id, 10),
      },
      data: {
        taskId: taskId ? parseInt(taskId, 10) : undefined,
        categoryId: categoryId ? parseInt(categoryId, 10) : undefined,
      },
    });

    res
      .status(200)
      .json({
        message: 'TaskCategory updated successfully',
        updatedTaskCategory,
      });
  } catch (error) {
    console.error('Error updating task category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
