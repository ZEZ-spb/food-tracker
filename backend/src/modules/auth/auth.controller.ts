import { Request, Response, NextFunction } from 'express'
import * as authService from './auth.service'
import { AuthRequest } from '../../middlewares/authenticate'
import { User } from '../../entities/User'

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await authService.register(req.body)
    res.status(201).json({
      message: 'Пользователь успешно зарегистрирован',
      userId: user.id
    })
  } catch (error) {
    next(error)
  }
}

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token, currency } = await authService.login(req.body)
    res.json({ token, currency })
  } catch (error) {
    next(error)
  }
}

export const updateEmailController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    await authService.updateEmail(req.userId!, req.body)
    res.json({ message: 'Email успешно изменён' })
  } catch (error) {
    next(error)
  }
}

export const updatePasswordController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    await authService.updatePassword(req.userId!, req.body)
    res.json({ message: 'Пароль успешно изменён' })
  } catch (error) {
    next(error)
  }
}

export const logoutController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  res.json( { message: 'Вы вышли из системы' } )
}

export const removeController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
try {
    await authService.removeUser(req.userId!)
    res.json({ message: 'Ваш аккаунт удален' })
  } catch (error) {
    next(error)
  }
}

export const getUsersController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
)=> {
try {
  const users: User[] = await authService.getUsers()
  res.json(users)
} catch (error) {
    next(error)
  }
}

export const updateCurrencyController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    await authService.updateCurrency(req.userId!, req.body)
    res.json({ message: 'Валюта успешно изменена' })
  } catch (error) {
    next(error)
  }
}

