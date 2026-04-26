export interface Product {
  id: number
  name: string
  unit: 'шт.' | 'кг' | 'л'
  quantity: number
  min_quantity: number | null
  photo_url: string | null
  created_at: string
}

export interface User {
  id: number
  email: string
}

export interface Transaction {
  id: number
  product_id: number
  user_id: number
  type: 'purchase' | 'expense' | 'adjustment'
  quantity_delta: number
  quantity_after: number
  cost: number | null
//  currency: 'ILS' | 'EUR' | 'USD' | 'RUB' | null
  note: string | null
  created_at: string
  product: Product
}

export interface AuthResponse {
  token: string
  currency: 'ILS' | 'EUR' | 'USD' | 'RUB'
}

export interface ApiError {
  message: string
}

export interface ProductsTableProps {
  products: Product[]
  token: string
  createProduct: (token: string, name: string, unit: 'шт.' | 'кг' | 'л',
    quantity: number, min_quantity: number | null) => Promise<void>
  updateProduct: (token: string, id: number, name: string, unit: 'шт.' | 'кг' | 'л',
    quantity: number, min_quantity: number | null) => Promise<void>
  removeProduct: (token: string, id: number) => Promise<void>
  updatePhoto: (token: string, id: number, file: File) => Promise<void>
  removePhoto: (token: string, id: number) => Promise<void>
  getProducts: (token: string) => Promise<void>
  createTransaction: (
    token: string, 
    product_id: number, 
    type: 'purchase' | 'expense',
    quantity: number, 
    cost?: number, 
    //currency?: 'ILS' | 'EUR' | 'USD' | 'RUB'
  ) => Promise<void>
//  currency: string
}

export interface TransactionsPageProps {
  transactions: Transaction[]
  token: string
  period: '1m' | '3m' | '6m' | '1y'
  getTransactions: (token: string, period: '1m' | '3m' | '6m' | '1y') => Promise<void>
  removeTransaction: (token: string, id: number) => Promise<void>
  updateTransaction: (
    token: string, 
    id: number, 
    quantity_delta: number, 
    cost?: number | null, 
//    currency?: string | null
  ) => Promise<void>
  currency: string
}