import axios from './axios'
import type { AuthResponse } from '../types'

export const register = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post(`/auth/register`, { email, password })
  return response.data
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post(`/auth/login`, { email, password })
  return response.data
}

export const logout = async (token: string): Promise<void> => {
  await axios.post(`/auth/logout`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

export const removeUser = async (token: string): Promise<void> => {
  await axios.delete(`/auth/`, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

export const updateEmail = async (token: string, email: string): Promise<void> => {
  await axios.patch(`/auth/update-email`, { email }, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

export const updatePassword = async (token: string, currentPassword: string, newPassword: string): Promise<void> => {
  await axios.patch(`/auth/update-password`, { currentPassword, newPassword }, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

export const updateCurrency = async (token: string, currency: 'ILS' | 'EUR' | 'USD' | 'RUB'): Promise<void> => {
  await axios.patch(`/auth/update-currency`, { currency }, {
    headers: { Authorization: `Bearer ${token}` }
  })
}