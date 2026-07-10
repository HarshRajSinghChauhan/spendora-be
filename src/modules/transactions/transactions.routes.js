import express from 'express';
import auth from '../../middlewares/auth.middleware.js';
import transactionsController from './transactions.controller.js';
import validate from '../../middlewares/validate.middleware.js';
import { createTransactionSchema, updateTransactionSchema } from './transactions.validate.js';

const router = express.Router();

router.post('/', auth, validate(createTransactionSchema), transactionsController.createTransaction);
router.get('/', auth, transactionsController.getAllTransactions);
router.put('/:id', auth, validate(updateTransactionSchema), transactionsController.updateTransaction);
router.delete('/:id', auth, transactionsController.deleteTransaction);

export default router;