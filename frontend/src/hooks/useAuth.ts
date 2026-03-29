import { useState } from 'react';
import * as authApi from '../api/auth.api'

export const useAuth = () => {
    const [token, setToken] = useState<string>(localStorage.getItem('token') || '')
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'))

    const login = async (email: string, password: string) => {
        const response = await authApi.login(email, password)
        setToken(response.token)
        localStorage.setItem('token', response.token)
        setIsAuthenticated(true)
    }

    const register = async (email: string, password: string) => {
        const response = await authApi.register(email, password)
        setToken(response.token)
        localStorage.setItem('token', response.token)
        setIsAuthenticated(true)
    }

    const logout = async () => {
        await authApi.logout(token)
        setToken('')
        localStorage.removeItem('token')
        setIsAuthenticated(false)
    }

    return { token, isAuthenticated, login, register, logout }
}