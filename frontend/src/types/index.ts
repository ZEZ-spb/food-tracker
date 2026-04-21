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
  removeProduct: (token: string, id: number)=> Promise<void>
  updatePhoto: (token: string, id: number, file: File)=> Promise<void>
  removePhoto: (token: string, id: number)=> Promise<void>
  getProducts: (token: string) => Promise<void>
}