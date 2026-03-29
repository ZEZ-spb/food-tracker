import { IsString, IsEnum, IsNumber, IsOptional, Min } from 'class-validator'

const UNITS = ['шт.', 'кг', 'л'] as const

export class ProductDto {
  @IsString({ message: 'Название должно быть строкой' })
  name: string

  @IsEnum(UNITS, { message: 'Единица измерения: шт, кг или л' })
  unit: 'шт.' | 'кг' | 'л'

  @IsNumber()
  @Min(0, { message: 'Количество не может быть отрицательным' })
  quantity: number

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Норма не может быть отрицательной' })
  min_quantity?: number | null
}
