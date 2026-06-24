import express from 'express';
import categoriesController from "./categories.controller.js"
import validate from '../../middlewares/validate.middleware.js';
import { createCategorySchema } from './categories.validate.js';
import auth from '../../middlewares/auth.middleware.js';
const router = express.Router();

router.post('/create-category', auth, validate(createCategorySchema), categoriesController.createCategory);
router.get('/list-all-categories',auth, categoriesController.getAllCategories);

export default router;