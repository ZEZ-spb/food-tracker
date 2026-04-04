import { AppDataSource } from '../../config/database'
import { User } from '../../entities/User'
import { AppError } from '../../utils/AppError'
import { RegisterDto, LoginDto, UpdateEmailDto, UpdatePasswordDto } from './auth.types'
import { generateAccessToken } from '../../utils/jwt'
import bcrypt from 'bcryptjs'

const userRepository = AppDataSource.getRepository(User)

export const register = async (dto: RegisterDto): Promise<User> => {
  const existing = await userRepository.findOne({
    where: { email: dto.email }
  })

  if (existing) {
    throw new AppError('Пользователь с таким email уже существует', 409)
  }

  const password_hash = await bcrypt.hash(dto.password, 10)

  const user = userRepository.create({
    email: dto.email,
    password_hash
  })

  return userRepository.save(user)
}

export const login = async (dto: LoginDto): Promise<string> => {
  const user = await userRepository.findOne({
    where: { email: dto.email }
  })

  if (!user) {
    throw new AppError('Неверный email или пароль', 401)
  }

  const isPasswordValid = await bcrypt.compare(dto.password, user.password_hash)

  if (!isPasswordValid) {
    throw new AppError('Неверный email или пароль', 401)
  }

  return generateAccessToken(user.id)

}

export const updateEmail = async (userId: number, dto: UpdateEmailDto) => {
  const user = await userRepository.findOne({
    where: { id: userId }
  })

  if (!user) {
    throw new AppError('Пользователь не найден', 401)
  }

  const existing = await userRepository.findOne({
    where: { email: dto.email }
  })

  if (existing) {
    throw new AppError('Этот email уже занят', 409)
  }

  user.email = dto.email
  return userRepository.save(user)
}

export const updatePassword = async (userId: number, dto: UpdatePasswordDto) => {
  const user = await userRepository.findOne({
    where: { id: userId }
  })

  if (!user) {
    throw new AppError('Пользователь не найден', 401)
  }

  const isPasswordValid = await bcrypt.compare(dto.currentPassword, user.password_hash)

  if (!isPasswordValid) {
    throw new AppError('Неверный текущий пароль', 401)
  }

  user.password_hash = await bcrypt.hash(dto.newPassword, 10)
  return userRepository.save(user)
}

export const removeUser = async (userId: number) => {
const user = await userRepository.findOne({
    where: { id: userId }
  })

  if (!user) {
    throw new AppError('Пользователь не найден', 404)
  }

return userRepository.remove(user)
}

export const getUsers = async() => {
  const users = await userRepository.find({
    select: ['id', 'email', 'created_at']
  })

  if (users.length === 0)
    throw new AppError('Пользователи не найдены', 404)

  return users
}