import cloudinary from '../../config/cloudinary'
import { AppDataSource } from '../../config/database'
import { Product } from '../../entities/Product'
import { StockTransaction } from '../../entities/StockTransaction'
import { AppError } from '../../utils/AppError'
import { ProductDto } from './products.types'
import { Readable } from 'stream'


const productRepository = AppDataSource.getRepository(Product)
const transactionRepository = AppDataSource.getRepository(StockTransaction)

export const createProduct = async (userId: number, dto: ProductDto): Promise<Product> => {
  const existing = await productRepository.findOne({
    where: { name: dto.name, user_id: userId }
  })

  if (existing) {
    throw new AppError('Такой продукт уже существует', 409)
  }

  const product = productRepository.create({
    user_id: userId,
    name: dto.name,
    unit: dto.unit,
    quantity: dto.quantity,
    min_quantity: dto.min_quantity ?? null
  })

  return productRepository.save(product)
}

export const getProducts = async (userId: number): Promise<Product[]> => {
  const products: Product[] = await productRepository.find({
    where: { user_id: userId },
    order: { name: 'ASC' }
  })
  if (products.length === 0)
    throw new AppError('Продуктов пока нет', 404)

  return products
}

export const updateProduct = async (id: number, userId: number, dto: ProductDto): Promise<Product> => {
  let product = await productRepository.findOne({
    where: { id, user_id: userId }
  })

  if (!product)
    throw new AppError('Такого продукта нет', 404)

  let type: 'purchase' | 'expense' | '' = ''

  let quantity_delta = dto.quantity - product.quantity
  if (quantity_delta > 0) {
    type = 'purchase'
  } else {
    if (quantity_delta < 0)
      type = 'expense'
    quantity_delta = -quantity_delta
  }

  if (type !== '') {
    const transaction = transactionRepository.create({
      product_id: id,
      user_id: userId,
      type: type as 'purchase' | 'expense',
      quantity_delta: quantity_delta,
      quantity_after: dto.quantity,
      cost: null,
      currency: null
    })

    console.log('updateProduct userId:', userId, 'quantity_delta:', quantity_delta)

    await transactionRepository.save(transaction)
  }

  product.name = dto.name,
    product.unit = dto.unit,
    product.quantity = dto.quantity,
    product.min_quantity = dto.min_quantity ?? null

  return productRepository.save(product)
}

export const removeProduct = async (id: number, userId: number): Promise<Product> => {
  const product = await productRepository.findOne({
    where: { id, user_id: userId }
  })

  if (!product)
    throw new AppError('Такого продукта нет', 404)

  return productRepository.remove(product)

}

export const updatePhoto = async (id: number, userId: number, file: Express.Multer.File): Promise<Product> => {
  const product = await productRepository.findOne({
    where: { id, user_id: userId }
  })

  if (!product)
    throw new AppError('Такого продукта нет', 404)

  // Если было старое фото - удаляем его из Cloudinary
  if (product.photo_url) {
    const publicId = product.photo_url.split('/').pop()?.split('.')[0]
    if (publicId) await cloudinary.uploader.destroy(`food-tracker/${publicId}`)
  }

  // Загружаем новое фото в Cloudinary через stream
  const uploadResult = await new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'food-tracker' },
      (error, result) => {
        if (error) reject(error)
        else resolve(result!.secure_url)
      }
    )
    Readable.from(file.buffer).pipe(stream)
  })

  product.photo_url = uploadResult
  return productRepository.save(product)
}

export const removePhoto = async (id: number, userId: number): Promise<Product> => {
  const product = await productRepository.findOne({
    where: { id, user_id: userId }
  })

  if (!product)
    throw new AppError('Такого продукта нет', 404)

  if (!product.photo_url)
    throw new AppError('У продукта нет фото', 404)

  const publicId = product.photo_url.split('/').pop()?.split('.')[0]
  if (publicId) await cloudinary.uploader.destroy(`food-tracker/${publicId}`)

  product.photo_url = null
  return productRepository.save(product)
}