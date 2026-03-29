import { useState } from 'react';
import * as productsApi from '../api/products.api'
import type { Product } from '../types';

export const useProducts = () => {

    const [products, setProducts] = useState<Product[]>([])

    const getProducts = async (
        token: string,
    ) => {
        const response = await productsApi.getProducts(
            token
        )
        setProducts(response)
    }

    const createProduct = async (
        token: string,
        name: string,
        unit: 'шт.' | 'кг' | 'л',
        quantity: number,
        min_quantity: number | null
    ) => {
        await productsApi.createProduct(
            token,
            name,
            unit,
            quantity,
            min_quantity
        )
        await getProducts(token)
    }

    const updateProduct = async (
        token: string,
        id: number,
        name: string,
        unit: 'шт.' | 'кг' | 'л',
        quantity: number,
        min_quantity: number | null
    ) => {
        await productsApi.updateProduct(
            token,
            id,
            name,
            unit,
            quantity,
            min_quantity
        )
        await getProducts(token)
    }

    const removeProduct = async (
        token: string,
        id: number,
    ) => {
        await productsApi.removeProduct(
            token,
            id
        )
        await getProducts(token)
    }

    const updatePhoto = async (
        token: string,
        id: number,
        file: File
    ) => {
        await productsApi.updatePhoto(
            token,
            id,
            file
        )
        await getProducts(token)
    }

    const removePhoto = async (
        token: string,
        id: number
    ) => {
        await productsApi.removePhoto(
            token,
            id
        )
        await getProducts(token)
    }

    return {
        products, getProducts, createProduct, updateProduct,
        removeProduct, updatePhoto, removePhoto
    }
}