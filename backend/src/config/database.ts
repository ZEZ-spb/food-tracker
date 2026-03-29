import { DataSource } from 'typeorm'
import { User } from '../entities/User'
import { Product } from '../entities/Product'
import { StockTransaction } from '../entities/StockTransaction'
import 'reflect-metadata'
import dotenv from 'dotenv'

dotenv.config()

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Product, StockTransaction],
})