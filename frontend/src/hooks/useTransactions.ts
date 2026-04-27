import { useState } from 'react'
import * as transactionsApi from '../api/transactions.api'
import type { Transaction } from '../types'

export const useTransactions = () => {

    const [transactions, setTransactions] = useState<Transaction[]>([])

    const getTransactions = async (
        token: string,
        period: '1m' | '3m' | '6m' | '1y'
    ) => {
        const response = await transactionsApi.getTransactions(
            token,
            period
        )
        setTransactions(response)
    }

    const createTransaction = async (
        token: string,
        product_id: number,
        type: 'purchase' | 'expense',
        quantity: number,
        cost?: number,
    ) => {
        await transactionsApi.createTransaction(
            token,
            product_id,
            type,
            quantity,
            cost,
        )
    }

    const updateTransaction = async (
        token: string,
        id: number,
        quantity: number,
        cost?: number | null,
    ) => {
        await transactionsApi.updateTransaction(
            token,
            id,
            quantity,
            cost,
        )
    }

    const removeTransaction = async (
        token: string,
        id: number,
    ) => {
        await transactionsApi.removeTransaction(
            token,
            id
        )
    }

    return { transactions, createTransaction, getTransactions, updateTransaction, removeTransaction }
}