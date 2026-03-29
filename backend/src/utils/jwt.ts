import jwt from 'jsonwebtoken'

export const generateAccessToken = (userId: number): string => {
  return jwt.sign(
    { userId },
    process.env.JWT_ACCESS_SECRET as string,
    { expiresIn: '7d' }
  )
}