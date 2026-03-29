import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm'
import { User } from './User'
import { StockTransaction } from './StockTransaction'

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, (user) => user.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column()
  user_id: number

  @Column()
  name: string

  @Column({ type: 'enum', enum: ['шт.', 'кг', 'л'], default: 'шт.' })
  unit: 'шт.' | 'кг' | 'л'

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  quantity: number

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  min_quantity: number | null

  @Column({ type: 'varchar', nullable: true })
  photo_url: string | null

  @CreateDateColumn()
  created_at: Date

  @OneToMany(() => StockTransaction, (transaction) => transaction.product)
  transactions: StockTransaction[]
}