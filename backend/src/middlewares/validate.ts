import { Request, Response, NextFunction } from 'express'
import { validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'

export const validateBody = (DtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const instance = plainToInstance(DtoClass, req.body)
    const errors = await validate(instance)

    if (errors.length > 0) {
      const messages = errors.map(err =>
        Object.values(err.constraints || {}).join(', ')
      )
      res.status(400).json({ message: messages.join('; ') })
      return
    }

    next()
  }
}