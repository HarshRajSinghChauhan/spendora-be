import express from 'express';
import categoriesController from "./categories.controller.js"
import validate from '../../middlewares/validate.middleware.js';
import { createCategorySchema } from './categories.validate.js';
import auth from '../../middlewares/auth.middleware.js';
const router = express.Router();

router.post('/', auth, validate(createCategorySchema), categoriesController.createCategory);
router.get('/',auth, categoriesController.getAllCategories);
router.get('/:id', auth,categoriesController.getCategoryById);
router.delete('/:id', auth,categoriesController.deleteCategoryById);


export default router;