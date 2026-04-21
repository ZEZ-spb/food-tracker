import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator'

export class RegisterDto {
  @IsEmail({}, { message: 'Некорректный email' })
  email: string

  @IsString()
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
  password: string
}

export class LoginDto {
  @IsEmail({}, { message: 'Некорректный email' })
  email: string

  @IsString()
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
  password: string
}

export class UpdateEmailDto {
  @IsEmail({}, { message: 'Некорректный email' })
  email: string
}

export class UpdatePasswordDto {
  @IsString()
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
  currentPassword: string

  @IsString()
  @MinLength(6, { message: 'Новый пароль должен содержать минимум 6 символов' })
  newPassword: string
}

export class UpdateCurrencyDto {
  @IsEnum(['ILS', 'EUR', 'USD', 'RUB'], { message: 'Некорректная валюта' })
  currency: 'ILS' | 'EUR' | 'USD' | 'RUB'
}