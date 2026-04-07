import { useState } from 'react';
import * as authApi from '../api/auth.api'

export const useAuth = () => {
    const [token, setToken] = useState<string>(localStorage.getItem('token') || '')
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'))
    const [email, setEmail] = useState<string>(localStorage.getItem('email') || '')
    const [password, setPassword] = useState<string>('')

    const login = async (email: string, password: string) => {
        const response = await authApi.login(email, password)
        setToken(response.token)
        setEmail(email)
        localStorage.setItem('token', response.token)
        localStorage.setItem('email', email)
        setIsAuthenticated(true)
    }

    const register = async (email: string, password: string) => {
        await authApi.register(email, password)
        // сразу логинимся
        const response = await authApi.login(email, password)
        setToken(response.token)
        setEmail(email)
        localStorage.setItem('token', response.token)
        localStorage.setItem('email', email)
        setIsAuthenticated(true)
    }

    const logout = async () => {
        await authApi.logout(token)
        setToken('')
        setEmail('')
        localStorage.removeItem('token')
        localStorage.removeItem('email')
        setIsAuthenticated(false)
    }

    const removeUser = async (token: string) => {
        await authApi.removeUser(token)
        setToken('')
        setEmail('')
        localStorage.removeItem('token')
        localStorage.removeItem('email')
        setIsAuthenticated(false)
    }

    const updateEmail = async (email: string) => {
        await authApi.updateEmail(token, email)
        setEmail(email)
        localStorage.setItem('email', email)
        //setShowEmailModal(false)
        //setEmail('')
    }






const updatePassword = async (currentPassword: string, newPassword: string) => {
//        const password = await authApi.find(password )
        await authApi.updatePassword(token, currentPassword, newPassword)
        setPassword(password)
        //localStorage.setItem('email', email)
        //setShowEmailModal(false)
        //setEmail('')
    }





    return { token, email, isAuthenticated, login, register, logout, removeUser, updateEmail, updatePassword }
}