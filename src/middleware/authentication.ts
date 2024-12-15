import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import process from 'process'
export const authenticateToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers['authorization']

    const token = authHeader?.split(' ')[1]

    if (!token) {
      res
        .status(401)
        .send({ statusCode: 401, error: null, message: 'No token provided' })
      return
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
      if (err) {
        res.sendStatus(403)
        return
      }

      if (typeof user === 'object' && user !== null && 'id' in user) {
        req.user = user as { id: number } | undefined
      }
    })

    next()
  } catch (error: Error | any) {
    next(
      new Error(
        'Error at src/middleware/authentication.ts: authenticateToken => ' +
          error.message
      )
    )
  }
}

export interface CustomRequest extends Request {
  user?: { id: number } // Assuming the user object only has an id property
}
