import { Router } from 'express'
import { authenticate } from '../../middlewares/authenticate'
import { validateBody } from '../../middlewares/validate'
import { ProductDto } from './products.types'
import { createProduct, getProducts, updateProduct, removeProduct, updatePhoto, removePhoto } from './products.controller'
import { upload } from '../../config/multer'

const router = Router()

router.post('/',                    // POST / = создать продукт    
    authenticate, 
    validateBody(ProductDto), 
    createProduct)

router.get('/',                     //GET   / = получить все свои продукты
    authenticate,
    getProducts)  
    
router.put('/:id',                  //PUT   / = обновить продукт
    authenticate,
    validateBody(ProductDto), 
    updateProduct) 

router.delete('/:id',                //DELETE   / = удалить продукт
    authenticate,
    removeProduct) 
    
router.patch('/:id/photo',
    authenticate,
    upload.single('photo'),
    updatePhoto)  

router.delete('/:id/photo',
    authenticate,
    removePhoto)        

export default router