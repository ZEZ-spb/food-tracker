import { Router } from 'express'
import { registerController, loginController, updateEmailController, 
    updatePasswordController, logoutController, removeController } from './auth.controller'
import { validateBody } from '../../middlewares/validate'
import { RegisterDto, LoginDto, UpdateEmailDto, UpdatePasswordDto } from './auth.types'
import { authenticate } from '../../middlewares/authenticate'

const router = Router()

router.post('/register', 
    validateBody(RegisterDto), 
    registerController)

router.post('/login', 
    validateBody(LoginDto), 
    loginController)

router.patch('/update-email',
    authenticate,
    validateBody(UpdateEmailDto),
    updateEmailController)

router.patch('/update-password',
    authenticate,
    validateBody(UpdatePasswordDto),
    updatePasswordController)

router.post('/logout',
    authenticate,
    logoutController)
    
router.delete('/',
    authenticate,
    removeController)    

export default router