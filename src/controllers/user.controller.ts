import { NextFunction, Request, Response } from 'express'
import prisma from '../db'
import { CustomRequest } from '../middleware/authentication'
import bcrypt from 'bcrypt'
export const userControllerFindMany = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await prisma.user.findMany()
    res.status(200).json({
      statusCode: 200,
      message: 'Success fetching users',
      data: users,
      error: null
    })
    return
  } catch (error: Error | any) {
    next(
      new Error(
        'Error at src/controllers/user.controller.ts: userControllerFindMany => ' +
          error.message
      )
    )
  }
}

export const getUserProfile = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id

    if (!userId) {
      res.status(400).json({
        statusCode: 400,
        message: 'User ID is missing',
        data: null,
        error: 'User ID is missing'
      })
      return
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: {
        id: true,
        username: true,
        email: true
      }
    })

    if (!user) {
      res.status(404).json({
        statusCode: 404,
        message: 'User not found',
        data: null,
        error: 'Not found'
      })
      return
    }

    res.status(200).json({
      statusCode: 200,
      message: null,
      data: user,
      error: null
    })
    return
  } catch (error: Error | any) {
    next(
      new Error(
        'Error at src/controllers/user.controller.ts: getUserProfile => ' +
          error.message
      )
    )
  }
}

export const updateUserProfile = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
      res.status(400).json({
        statusCode: 400,
        message: 'Username, email, and password are required.',
        data: null,
        error: 'Username, email, and password are required.'
      })
      return
    }

    const hashPassword = bcrypt.hashSync(password, 8)

    const existUserByUsername = await prisma.user.findUnique({
      where: {
        username: String(username)
      }
    })

    const existUserByEmail = await prisma.user.findUnique({
      where: {
        email: String(email)
      }
    })

    if (existUserByEmail || existUserByUsername) {
      res.status(401).json({
        statusCode: 401,
        message: 'Username or Email already used.',
        data: null,
        error: 'Username or Email already used.'
      })
      return
    }

    const update = await prisma.user.update({
      where: {
        id: req.user?.id
      },
      data: {
        username: String(username),
        email: String(email),
        password: hashPassword
      }
    })

    res.status(201).json({
      statusCode: 201,
      message: 'User updated',
      data: update,
      error: null
    })
    return
  } catch (error: Error | any) {
    next(
      new Error(
        'Error at src/controller/user.controller.ts: updateUserProfile => ' +
          error.message
      )
    )
  }
}

export const deleteUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const deleted = await prisma.user.delete({
      where: {
        id: req.user?.id
      }
    })

    res.status(201).json({
      statusCode: 201,
      message: `user ${deleted.username} deleted`,
      data: deleted,
      error: null
    })
    return
  } catch (error: Error | any) {
    next(
      new Error('Error at src/controllers/user.controller.ts: deleteUser => ')
    ) + error.message
  }
}
