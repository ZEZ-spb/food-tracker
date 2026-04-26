import { AppDataSource } from "../../config/database";
import { Product } from "../../entities/Product";
import { StockTransaction } from "../../entities/StockTransaction";
import { AppError } from "../../utils/AppError";
import { PeriodType } from "./transactions.types";
import { LessThan, MoreThanOrEqual } from 'typeorm'

const transactionRepository = AppDataSource.getRepository(StockTransaction)
const productRepository = AppDataSource.getRepository(Product)

export const createTransaction = async (
    userId: number,
    productId: number,
    type: 'purchase' | 'expense',
    delta: number,
    cost?: number,
    // currency?: 'ILS' | 'EUR' | 'USD' | 'RUB'
): Promise<StockTransaction> => {

    const product = await productRepository.findOne({
        where: { user_id: userId, id: productId }
    })

    if (!product) {
        throw new AppError('Такого продукта не существует', 404)
    }

    if (type === 'purchase') {
        product.quantity = Number(product.quantity) + delta
    } else {
        if (delta > Number(product.quantity)) {
            throw new AppError('Расход превышает текущее количество', 400)
        }
        product.quantity = Number(product.quantity) - delta
    }

    await productRepository.save(product)

    const transaction = transactionRepository.create({
        product_id: productId,
        user_id: userId,
        type,
        quantity_delta: type === 'purchase' ? delta : -delta,
        quantity_after: product.quantity,
        cost: cost ?? null,
//        currency: currency ?? null
    })

    return transactionRepository.save(transaction)
}

const getStartDate = (period: PeriodType): Date => {
    const now = new Date()
    switch (period) {
        case '1m':
            return new Date(now.setMonth(now.getMonth() - 1))
        case '3m':
            return new Date(now.setMonth(now.getMonth() - 3))
        case '6m':
            return new Date(now.setMonth(now.getMonth() - 6))
        case '1y':
            return new Date(now.setFullYear(now.getFullYear() - 1))
    }
}

export const getTransactions = async (
    userId: number,
    period: PeriodType
): Promise<StockTransaction[]> => {
    await transactionRepository.delete({
        user_id: userId,
        created_at: LessThan(new Date(new Date().setFullYear(new Date().getFullYear() - 1)))
    })

    const transactions = await transactionRepository.find({
        where: {
            user_id: userId,
            created_at: MoreThanOrEqual(getStartDate(period))
        },
        relations: ['product'],
        order: { created_at: 'DESC' }
    })
    return transactions
}

export const removeTransaction = async (id: number, userId: number): Promise<StockTransaction> => {
    const transaction = await transactionRepository.findOne({
        where: { id, user_id: userId }
    })

    if (!transaction)
        throw new AppError('Такой транзакции нет', 404)

    return transactionRepository.remove(transaction)

}

export const updateTransaction = async (
    id: number, 
    userId: number, 
    quantity_delta:
    number, cost?: 
    number, 
//    currency?: string | null
): Promise<StockTransaction> => {
    const transaction = await transactionRepository.findOne({
        where: { id, user_id: userId }
    })

    if (!transaction)
        throw new AppError('Такой транзакции нет', 404)

    transaction.quantity_delta = quantity_delta
    transaction.cost = cost ?? null
//    transaction.currency = currency as any ?? null

    return transactionRepository.save(transaction)
}
