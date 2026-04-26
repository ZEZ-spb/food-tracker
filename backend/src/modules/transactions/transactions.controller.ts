import { Response, NextFunction } from "express"
import { AuthRequest } from "../../middlewares/authenticate"
import * as transactionsService from './transactions.service'
import { PeriodType } from "./transactions.types"

export const createTransaction = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        await transactionsService.createTransaction(
            req.userId!,
            req.body.product_id,
            req.body.type,
            req.body.quantity,
            req.body.cost,
//            req.body.currency
        )
        res.status(201).json({ message: `Покупка/расход добавлен` })
    } catch (error) {
        next(error)
    }
}

export const getTransactions = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const transactions = await transactionsService.getTransactions(
            req.userId!,
            req.query.period as PeriodType
        )
        res.json(transactions)
    } catch (error) {
        next(error)
    }
}

export const removeTransaction = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        await transactionsService.removeTransaction(Number(req.params.id), req.userId!)
        res.status(200).json({ message: `Транзакция удалена` })
    } catch (error) {
        next(error)
    }
}

export const updateTransaction = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const transaction = await transactionsService.updateTransaction(
            Number(req.params.id), 
            req.userId!,
            req.body.quantity_delta, 
            req.body.cost, 
//            req.body.currency
        )
        res.json(transaction)
    } catch (error) {
        next(error)
    }
}