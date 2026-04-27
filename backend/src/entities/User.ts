import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm'
import { Product } from './Product'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  email: string

  @Column()
  password_hash: string

  @CreateDateColumn()
  created_at: Date

  @OneToMany(() => Product, (product) => product.user)
  products: Product[]

  @Column({
    type: 'enum',
    enum: ['ILS', 'EUR', 'USD', 'RUB'],
    default: 'ILS'
  })
  currency: 'ILS' | 'EUR' | 'USD' | 'RUB'
}