import axios from 'axios'
import type { AuthResponse } from '../types'

//const API_URL = 'http://localhost:3000/api'
const API_URL = import.meta.env.VITE_API_URL

export const register = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/auth/register`, { email, password })
  return response.data
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password })
  return response.data
}

export const logout = async (token: string): Promise<void> => {
  await axios.post(`${API_URL}/auth/logout`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

export const removeUser = async (token: string): Promise<void> => {
  await axios.delete(`${API_URL}/auth/`, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

export const updateEmail = async (token: string, email: string): Promise<void> => {
  await axios.patch(`${API_URL}/auth/update-email`, { email}, { 
    headers: { Authorization: `Bearer ${token}` }
  })

}







export const updatePassword = async (token: string, currentPassword: string, newPassword: string): Promise<void> => {
  await axios.patch(`${API_URL}/auth/update-email`, { currentPassword, newPassword}, { 
    headers: { Authorization: `Bearer ${token}` }
  })

}