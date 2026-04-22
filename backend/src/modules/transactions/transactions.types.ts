import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator'

export class CreateTransactionDto {
  @IsNumber()
  product_id: number

  @IsEnum(['purchase', 'expense'], { message: 'Тип должен быть purchase или expense' })
  type: 'purchase' | 'expense'

  @IsNumber()
  @Min(0.01, { message: 'Количество должно быть больше 0' })
  quantity: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  cost?: number

  @IsOptional()
  @IsEnum(['ILS', 'EUR', 'USD', 'RUB'])
  currency?: 'ILS' | 'EUR' | 'USD' | 'RUB'

  @IsOptional()
  @IsString()
  note?: string
}

export type PeriodType = '1m' | '3m' | '6m' | '1y'