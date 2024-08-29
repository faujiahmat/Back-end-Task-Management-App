import prisma from '../db';
import { CustomRequest } from '../middleware/authentication';
import { Response } from 'express';

export const createCategory = async (req: CustomRequest, res: Response) => {
  try {
    const { name } = req.body;
    const userId = req.user?.id;

    // Validate the name
    if (!name || typeof name !== 'string' || name.trim() === '') {
      res.status(400).send({
        message: 'Invalid category name. It must be a non-empty string.',
      });
      return;
    }

    // Check if a category with the same name already exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: name.trim(),
      },
    });

    if (existingCategory) {
      res
        .status(400)
        .send({ message: 'Category with this name already exists.' });
      return;
    }

    // Create the new category
    const newCategory = await prisma.category.create({
      data: {
        name: name.trim(),
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    // Send the created category details
    res
      .status(201)
      .send({ message: 'Category created successfully', data: newCategory });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

export const getAllCategories = async (req: CustomRequest, res: Response) => {
  try {
    // Ensure the user is authenticated and has a valid userId
    if (!req.user || !req.user?.id) {
      res.status(401).send({ message: 'Unauthorized. Please log in.' });
      return;
    }

    // Fetch categories belonging to the logged-in user
    const categories = await prisma.category.findMany({
      where: {
        userId: req.user?.id,
      },
    });

    // Check if there are any categories
    if (categories.length === 0) {
      res.status(404).send({ message: 'No categories found for this user.' });
      return;
    }

    // Send the list of categories
    res
      .status(200)
      .send({ message: 'Categories retrieved successfully', data: categories });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

export const getCategoryById = async (req: CustomRequest, res: Response) => {
  try {
    const { categoryId } = req.params;

    // Validate the categoryId format (assuming it's a number)
    const parsedCategoryId = parseInt(categoryId, 10);
    if (isNaN(parsedCategoryId)) {
      res
        .status(400)
        .send({ message: 'Invalid categoryId format. It must be a number.' });
      return;
    }

    // Ensure the user is authenticated
    if (!req.user || !req.user.id) {
      res.status(401).send({ message: 'Unauthorized. Please log in.' });
      return;
    }

    // Fetch the category by ID, ensuring it belongs to the logged-in user
    const category = await prisma.category.findFirst({
      where: {
        id: parsedCategoryId,
        userId: req.user.id,
      },
    });

    // Check if the category exists
    if (!category) {
      res.status(404).send({
        message: 'Category not found or does not belong to this user.',
      });
      return;
    }

    // Return the category details
    res
      .status(200)
      .send({ message: 'Category retrieved successfully', data: category });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

export const updateCategory = async (req: CustomRequest, res: Response) => {
  try {
    const { categoryId } = req.params;
    const { name } = req.body;

    // Validate the categoryId format (assuming it's a number)
    const parsedCategoryId = parseInt(categoryId, 10);
    if (isNaN(parsedCategoryId)) {
      res
        .status(400)
        .send({ message: 'Invalid categoryId format. It must be a number.' });
      return;
    }

    // Ensure the user is authenticated
    if (!req.user || !req.user.id) {
      res.status(401).send({ message: 'Unauthorized. Please log in.' });
      return;
    }

    // Validate the name field (if provided)
    if (name && (typeof name !== 'string' || name.trim() === '')) {
      res
        .status(400)
        .send({ message: 'Invalid name. It must be a non-empty string.' });
      return;
    }

    // Check if the category exists and belongs to the logged-in user
    const category = await prisma.category.findFirst({
      where: {
        id: parsedCategoryId,
        userId: req.user.id,
      },
    });

    if (!category) {
      res.status(404).send({
        message: 'Category not found or does not belong to this user.',
      });
      return;
    }

    // Update the category with the provided data
    const updatedCategory = await prisma.category.update({
      where: {
        id: parsedCategoryId,
      },
      data: {
        name: name ? name.trim() : category.name, // If name is provided, update it; otherwise, keep the current value
      },
    });

    // Return the updated category details
    res.status(200).send({
      message: 'Category updated successfully',
      data: updatedCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

export const deleteCategory = async (req: CustomRequest, res: Response) => {
  try {
    const { categoryId } = req.params;

    // Validate the categoryId format (assuming it's a number)
    const parsedCategoryId = parseInt(categoryId, 10);
    if (isNaN(parsedCategoryId)) {
      res
        .status(400)
        .send({ message: 'Invalid categoryId format. It must be a number.' });
      return;
    }

    // Ensure the user is authenticated
    if (!req.user || !req.user.id) {
      res.status(401).send({ message: 'Unauthorized. Please log in.' });
      return;
    }

    // Check if the category exists and belongs to the logged-in user
    const category = await prisma.category.findFirst({
      where: {
        id: parsedCategoryId,
        userId: req.user.id,
      },
    });

    if (!category) {
      res
        .status(404)
        .send({
          message: 'Category not found or does not belong to this user.',
        });
      return;
    }

    // Delete the category
    await prisma.category.delete({
      where: {
        id: parsedCategoryId,
      },
    });

    // Return success message
    res.status(200).send({ message: 'Category deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};
