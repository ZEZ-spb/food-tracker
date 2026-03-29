import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Product } from './Product'
import { User } from './User'

@Entity('stock_transactions')
export class StockTransaction {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Product, (product) => product.transactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product

  @Column()
  product_id: number

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column()
  user_id: number

  @Column({ type: 'enum', enum: ['purchase', 'expense', 'adjustment'] })
  type: 'purchase' | 'expense' | 'adjustment'

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity_delta: number

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity_after: number

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  cost: number | null

  @Column({ type: 'varchar', nullable: true })
  note: string | null

  @CreateDateColumn()
  created_at: Date
}