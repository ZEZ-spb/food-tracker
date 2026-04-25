import axios from "./axios";
import type { Transaction } from "../types";

export const createTransaction = async (
    token: string,
    product_id: number,
    type: 'purchase' | 'expense',
    quantity: number,
    cost?: number,
    currency?: 'ILS' | 'EUR' | 'USD' | 'RUB',
): Promise<Transaction> => {
    const response = await axios.post(
        `/transactions`,
        { product_id, type, quantity, cost, currency },
        { headers: { Authorization: `Bearer ${token}` } }
    )
    return response.data
}

export const getTransactions = async (
    token: string,
    period: '1m' | '3m' | '6m' | '1y'
): Promise<Transaction[]> => {
    const response = await axios.get(
        `/transactions`,
        {
            params: { period },
            headers: { Authorization: `Bearer ${token}` }
        }
    )
    return response.data
}

export const removeTransaction = async (
    token: string,
    id: number,
): Promise<void> => {
    await axios.delete(
        `/transactions/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
    )
}

export const updateTransaction = async (
    token: string,
    id: number,
    quantity_delta: number,
    cost?: number
): Promise<Transaction> => {
    const response = await axios.patch(
        `/transactions/${id}`,
        { quantity_delta, cost },
        { headers: { Authorization: `Bearer ${token}` } }
    )
    return response.data
}