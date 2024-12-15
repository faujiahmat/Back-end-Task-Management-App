import validator from 'validator'
import { Request, Response, NextFunction } from 'express'

export const registerValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password } = req.body

  if (username && email && password === '') {
    res.status(401).send({ message: 'All fields are required' })
    return
  }

  if (!validator.isEmail(email)) {
    res.status(400).send({
      message: 'invalid email address'
    })
    return
  }

  if (!validator.isStrongPassword(password)) {
    res.status(400).send({
      message:
        'password not strong. Password must be minimum 8 Character and include lowercase, uppercase, numbers, symbols'
    })
    return
  }

  next()
}
