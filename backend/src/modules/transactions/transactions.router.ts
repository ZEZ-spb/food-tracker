import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate";
import { validateBody } from "../../middlewares/validate";
import { CreateTransactionDto } from "./transactions.types";
import { createTransaction, getTransactions, removeTransaction, updateTransaction } from "./transactions.controller";

const router = Router()

router.post('/',                    // POST / = создать транзакцию    
    authenticate,
    validateBody(CreateTransactionDto),
    createTransaction)

router.get('/',                     //GET   / = получить все транзакции
    authenticate,
    getTransactions)  
    
router.delete('/:id',                //DELETE   / = удалить транзакцию
    authenticate,
    removeTransaction) 
    
router.patch('/:id',                  //PATCH   / = обновить транзакцию
    authenticate,
    updateTransaction)     

export default router    