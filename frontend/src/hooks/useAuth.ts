import { useState } from 'react';
import * as authApi from '../api/auth.api'

export const useAuth = () => {
    const [token, setToken] = useState<string>(localStorage.getItem('token') || '')
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'))
    const [email, setEmail] = useState<string>(localStorage.getItem('email') || '')
    const [currency, setCurrency] = useState<string>(localStorage.getItem('currency') || 'ILS')

    const login = async (email: string, password: string) => {
        const response = await authApi.login(email, password)
        setToken(response.token)
        setEmail(email)
        setCurrency(response.currency)
        localStorage.setItem('token', response.token)
        localStorage.setItem('email', email)
        localStorage.setItem('currency', response.currency)
        setIsAuthenticated(true)
    }

    const register = async (email: string, password: string) => {
        await authApi.register(email, password)
        // сразу логинимся
        const response = await authApi.login(email, password)
        setToken(response.token)
        setEmail(email)
        setCurrency(response.currency)
        localStorage.setItem('token', response.token)
        localStorage.setItem('email', email)
        localStorage.setItem('currency', response.currency)
        setIsAuthenticated(true)
    }

    const logout = async () => {
        await authApi.logout(token)
        setToken('')
        setEmail('')
        localStorage.removeItem('token')
        localStorage.removeItem('email')
        localStorage.removeItem('currency')
        setCurrency('ILS')
        setIsAuthenticated(false)
    }

    const removeUser = async (token: string) => {
        await authApi.removeUser(token)
        setToken('')
        setEmail('')
        localStorage.removeItem('token')
        localStorage.removeItem('email')
        localStorage.removeItem('currency')
        setCurrency('ILS')
        setIsAuthenticated(false)
    }

    const updateEmail = async (email: string) => {
        await authApi.updateEmail(token, email)
        setEmail(email)
        localStorage.setItem('email', email)
    }

    const updatePassword = async (currentPassword: string, newPassword: string) => {
        await authApi.updatePassword(token, currentPassword, newPassword)
    }

    const updateCurrency = async (currency: 'ILS' | 'EUR' | 'USD' | 'RUB') => {
        await authApi.updateCurrency(token, currency)
        setCurrency(currency)
        localStorage.setItem('currency', currency)
    }

    return {
        token, email, currency, isAuthenticated, login, register, logout, removeUser,
        updateEmail, updatePassword, updateCurrency
    }
}