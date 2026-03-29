import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AppError } from '../utils/AppError'

export interface AuthRequest extends Request {
  userId?: number
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Не авторизован', 401))
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as { userId: number }
    req.userId = payload.userId
    next()
  } catch {
    next(new AppError('Токен недействителен или истёк', 401))
  }
}
