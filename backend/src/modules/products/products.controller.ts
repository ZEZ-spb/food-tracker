import { Request, Response, NextFunction } from 'express'
import * as productsService from './products.service'
import { AuthRequest } from '../../middlewares/authenticate'
import { Product } from '../../entities/Product'

export const createProduct = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        await productsService.createProduct(req.userId!, req.body)
        res.status(201).json({ message: `Продукт ${req.body.name} добавлен` })
    } catch (error) {
        next(error)
    }
}

export const getProducts = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const products: Product[] = await productsService.getProducts(req.userId!)
        res.json(products)
    } catch (error) {
        next(error)
    }
}

export const updateProduct = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        await productsService.updateProduct(Number(req.params.id), req.userId!, req.body)
        res.status(200).json({ message: `Продукт ${req.body.name} обновлен` })
    } catch (error) {
        next(error)
    }
}

export const removeProduct = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        await productsService.removeProduct(Number(req.params.id), req.userId!)
        res.status(200).json({ message: `Продукт удален` })
    } catch (error) {
        next(error)
    }
}

export const updatePhoto = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'Файл не передан' })
            return
        }
        await productsService.updatePhoto(Number(req.params.id), req.userId!, req.file)
        res.json({ message: 'Фото продукта обновлено' })
    } catch (error) {
        next(error)
    }
}

export const removePhoto = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        await productsService.removePhoto(Number(req.params.id), req.userId!)
        res.json({ message: 'Фото продукта удалено' })
    } catch (error) {
        next(error)
    }
}









