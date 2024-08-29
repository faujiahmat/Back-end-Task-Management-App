import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
// import prisma from '../db';

export const authenticateToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers['authorization'];

    const token = authHeader?.split(' ')[1];

    if (!token) {
      res.status(401).send({ message: 'No token provided' });
      return;
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
      if (err) {
        console.error('JWT Verification Error:', err);
        res.sendStatus(403);
        return;
      }

      if (typeof user === 'object' && user !== null && 'id' in user) {
        req.user = user as { id: number } | undefined;
      }
    });

    next();
  } catch (err) {
    res.status(500).send({
      cose: 500,
      status: false,
      message: err,
      data: null,
    });
  }
};

// export const verifyAdmin = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const isAdmin = await prisma.user.findUnique({
//     where: {
//       id: req.user.id,
//     },
//   });

//   if (isAdmin?.role === 'admin') {
//     next();
//   } else {
//     res.status(401).send({ message: 'Unauthorized' });
//   }
// };

export interface CustomRequest extends Request {
  user?: { id: number }; // Assuming the user object only has an id property
}
