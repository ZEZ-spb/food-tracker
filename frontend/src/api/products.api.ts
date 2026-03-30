import axios from 'axios'
import type { Product } from '../types'

//const API_URL = 'http://localhost:3000/api'
const API_URL = import.meta.env.VITE_API_URL

export const createProduct = async (
    token: string,
    name: string,
    unit: 'шт.' | 'кг' | 'л',
    quantity: number,
    min_quantity: number | null
): Promise<Product> => {
    const response = await axios.post(
        `${API_URL}/products`,
        { name, unit, quantity, min_quantity },
        { headers: { Authorization: `Bearer ${token}` } }
    )
    return response.data
}

export const getProducts = async (
    token: string,
): Promise<Product[]> => {
    const response = await axios.get(
        `${API_URL}/products`,
        { headers: { Authorization: `Bearer ${token}` } }
    )
    return response.data
}

export const updateProduct = async (
    token: string,
    id: number,
    name: string,
    unit: 'шт.' | 'кг' | 'л',
    quantity: number,
    min_quantity: number | null
): Promise<Product> => {
    const response = await axios.put(
        `${API_URL}/products/${id}`,
        { name, unit, quantity, min_quantity },
        { headers: { Authorization: `Bearer ${token}` } }
    )
    return response.data
}

export const removeProduct = async (
    token: string,
    id: number,
): Promise<void> => {
    await axios.delete(
        `${API_URL}/products/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
    )
}

export const updatePhoto = async (
    token: string,
    id: number,
    file: File
): Promise<Product> => {
    const formData = new FormData()
    formData.append('photo', file)

    const response = await axios.patch(
        `${API_URL}/products/${id}/photo`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
    )
    return response.data
}

export const removePhoto = async (
    token: string,
    id: number,
): Promise<void> => {
    await axios.delete(
        `${API_URL}/products/${id}/photo`,
        { headers: { Authorization: `Bearer ${token}` } }
    )
}