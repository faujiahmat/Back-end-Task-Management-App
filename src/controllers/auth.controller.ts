import { NextFunction, Request, Response } from 'express'
import prisma from '../db'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import process from 'process'

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body

    const user = await prisma.user.findUnique({
      where: {
        username: String(username)
      }
    })

    const isPasswordValid = bcrypt.compareSync(password, user?.password || '')

    if (!user || !isPasswordValid) {
      return res.status(401).send({
        statusCode: 401,
        error: null,
        message: 'Invalid username or password'
      })
    }

    const token = jwt.sign(
      {
        id: user.id
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '1h'
      }
    )

    return res.status(200).send({
      statusCode: 200,
      error: null,
      message: 'Login success',
      data: user.username,
      token
    })
  } catch (error: Error | any) {
    return next(
      new Error(
        'Error at file src/controllers/auth.controller.ts: login => ' +
          error.message
      )
    )
  }
}

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = req.body
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
      return res.status(401).json({
        statusCode: 401,
        error: null,
        message: 'Username or Email already used.'
      })
    }
    const result = await prisma.user.create({
      data: {
        username: String(username),
        email: String(email),
        password: hashPassword
      }
    })

    return res.json({
      statusCode: 200,
      error: null,
      message: 'Register success',
      data: result
    })
  } catch (error: Error | any) {
    return next(
      new Error(
        'Error at file src/controllers/auth.controller.ts: register => ' +
          error.message
      )
    )
  }
}
