import { Request, Response } from 'express';
import prisma from '../db';
import { CustomRequest } from '../middleware/authentication';
import bcrypt from 'bcrypt';
export const userControllerFindMany = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    return res.status(200).send(users);
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

export const getUserProfile = async (req: CustomRequest, res: Response) => {
  try {
    console.log(req.user);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is missing' });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    return res.status(200).send(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const updateUserProfile = async (req: CustomRequest, res: Response) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400).json({
        message: 'Username, email, and password are required.',
      });
      return;
    }

    const hashPassword = bcrypt.hashSync(password, 8);

    const existUserByUsername = await prisma.user.findUnique({
      where: {
        username: String(username),
      },
    });

    const existUserByEmail = await prisma.user.findUnique({
      where: {
        email: String(email),
      },
    });

    if (existUserByEmail || existUserByUsername) {
      res.status(401).json({ message: 'Username or Email already used.' });
      return;
    }

    const update = await prisma.user.update({
      where: {
        id: req.user?.id,
      },
      data: {
        username: String(username),
        email: String(email),
        password: hashPassword,
      },
    });

    res.status(201).send({
      message: 'user updated',
      data: update,
    });
    return;
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

export const deleteUser = async (req: CustomRequest, res: Response) => {
  try {
    const deleted = await prisma.user.delete({
      where: {
        id: req.user?.id,
      },
    });

    res.status(201).send({
      message: `user ${deleted.username} deleted`,
    });
    return;
  } catch (error) {
    res.status(500).send({ message: 'Internal server error' });
    return;
  }
};
