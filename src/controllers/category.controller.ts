import prisma from '../db'
import { CustomRequest } from '../middleware/authentication'
import { NextFunction, Response } from 'express'

export const createCategory = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body
    const userId = req.user?.id

    // Validate the name
    if (!name || typeof name !== 'string' || name.trim() === '') {
      res.status(400).send({
        statusCode: 400,
        message: 'Invalid category name. It must be a non-empty string.',
        data: null,
        error: 'Invalid category name'
      })
      return
    }

    // Check if a category with the same name already exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: name.trim()
      }
    })

    if (existingCategory) {
      res.status(400).send({
        statusCode: 400,
        message: 'Category with this name already exists.',
        data: null,
        error: 'Category already exists'
      })
      return
    }

    // Create the new category
    const newCategory = await prisma.category.create({
      data: {
        name: name.trim(),
        user: {
          connect: {
            id: userId
          }
        }
      }
    })

    // Send the created category details
    res.status(201).send({
      statusCode: 201,
      message: 'Category created successfully',
      data: newCategory,
      error: null
    })
  } catch (error: Error | any) {
    next(
      new Error(
        'Error at src/controllers/category.controller.ts: createCategory: ' +
          error.message
      )
    )
  }
}

export const getAllCategories = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Ensure the user is authenticated and has a valid userId
    if (!req.user || !req.user?.id) {
      res.status(401).send({
        statusCode: 401,
        message: 'Unauthorized. Please log in.',
        data: null,
        error: 'Unauthorized'
      })
      return
    }

    // Fetch categories belonging to the logged-in user
    const categories = await prisma.category.findMany({
      where: {
        userId: req.user?.id
      }
    })

    // Check if there are any categories
    if (categories.length === 0) {
      res.status(404).send({
        statusCode: 404,
        message: 'No categories found for this user.',
        data: null,
        error: 'Not found'
      })
      return
    }

    // Send the list of categories
    res.status(200).send({
      statusCode: 200,
      message: 'Categories retrieved successfully',
      data: categories,
      error: null
    })
  } catch (error: Error | any) {
    next(
      new Error(
        'Error at src/controllers/category.controller.ts: getAllCategories: ' +
          error.message
      )
    )
  }
}

export const getCategoryById = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryId } = req.params

    // Validate the categoryId format (assuming it's a number)
    const parsedCategoryId = parseInt(categoryId, 10)
    if (isNaN(parsedCategoryId)) {
      res.status(400).send({
        statusCode: 400,
        message: 'Invalid categoryId format. It must be a number.',
        data: null,
        error: 'Invalid categoryId format'
      })
      return
    }

    // Ensure the user is authenticated
    if (!req.user || !req.user.id) {
      res.status(401).send({
        statusCode: 401,
        message: 'Unauthorized. Please log in.',
        data: null,
        error: 'Unauthorized'
      })
      return
    }

    // Fetch the category by ID, ensuring it belongs to the logged-in user
    const category = await prisma.category.findFirst({
      where: {
        id: parsedCategoryId,
        userId: req.user.id
      }
    })

    // Check if the category exists
    if (!category) {
      res.status(404).send({
        statusCode: 404,
        message: 'Category not found or does not belong to this user.',
        data: null,
        error: 'Not found'
      })
      return
    }

    // Return the category details
    res.status(200).send({
      statusCode: 200,
      message: 'Category retrieved successfully',
      data: category,
      error: null
    })
  } catch (error: Error | any) {
    next(
      new Error(
        'Error at src/controllers/category.controller.ts: getCategoryById' +
          error.message
      )
    )
  }
}

export const updateCategory = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryId } = req.params
    const { name } = req.body

    // Validate the categoryId format (assuming it's a number)
    const parsedCategoryId = parseInt(categoryId, 10)
    if (isNaN(parsedCategoryId)) {
      res.status(400).send({
        statusCode: 400,
        message: 'Invalid categoryId format. It must be a number.',
        data: null,
        error: 'Invalid categoryId format'
      })
      return
    }

    // Ensure the user is authenticated
    if (!req.user || !req.user.id) {
      res.status(401).send({
        statusCode: 401,
        message: 'Unauthorized. Please log in.',
        data: null,
        error: 'Unauthorized'
      })
      return
    }

    // Validate the name field (if provided)
    if (name && (typeof name !== 'string' || name.trim() === '')) {
      res.status(400).send({
        statusCode: 400,
        message: 'Invalid name. It must be a non-empty string.',
        data: null,
        error: 'Invalid name'
      })
      return
    }

    // Check if the category exists and belongs to the logged-in user
    const category = await prisma.category.findFirst({
      where: {
        id: parsedCategoryId,
        userId: req.user.id
      }
    })

    if (!category) {
      res.status(404).send({
        statusCode: 404,
        message: 'Category not found or does not belong to this user.',
        data: null,
        error: 'Not found'
      })
      return
    }

    // Update the category with the provided data
    const updatedCategory = await prisma.category.update({
      where: {
        id: parsedCategoryId
      },
      data: {
        name: name ? name.trim() : category.name // If name is provided, update it; otherwise, keep the current value
      }
    })

    // Return the updated category details
    res.status(200).send({
      statusCode: 200,
      message: 'Category updated successfully',
      data: updatedCategory,
      error: null
    })
  } catch (error: Error | any) {
    next(
      new Error(
        'Error at src/controllers/category.controller.ts: updateCategory: ' +
          error.message
      )
    )
  }
}

export const deleteCategory = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryId } = req.params

    // Validate the categoryId format (assuming it's a number)
    const parsedCategoryId = parseInt(categoryId, 10)
    if (isNaN(parsedCategoryId)) {
      res.status(400).send({
        statusCode: 400,
        message: 'Invalid categoryId format. It must be a number.',
        data: null,
        error: 'Invalid categoryId format'
      })
      return
    }

    // Ensure the user is authenticated
    if (!req.user || !req.user.id) {
      res.status(401).send({
        stattusCode: 401,
        message: 'Unauthorized. Please log in.',
        data: null,
        error: 'Unauthorized'
      })
      return
    }

    // Check if the category exists and belongs to the logged-in user
    const category = await prisma.category.findFirst({
      where: {
        id: parsedCategoryId,
        userId: req.user.id
      }
    })

    if (!category) {
      res.status(404).send({
        statusCode: 404,
        message: 'Category not found or does not belong to this user.',
        data: null,
        error: 'Not found'
      })
      return
    }

    // Delete the category
    const deletedCategory = await prisma.category.delete({
      where: {
        id: parsedCategoryId
      }
    })

    // Return success message
    res.status(200).send({
      statusCode: 200,
      message: 'Category deleted successfully.',
      data: deletedCategory,
      error: null
    })
  } catch (error: Error | any) {
    next(
      new Error(
        'Error at src/controllers/category.controller.ts: deleteCategory: ' +
          error.message
      )
    )
  }
}
