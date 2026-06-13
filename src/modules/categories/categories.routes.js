import express from 'express';
import categoriesController from "./categories.controller"
import validate from '../../middlewares/validate.middleware.js';
import { createCategorySchema } from './categories.validate.js';

const router = express.Router();

router.post('/create-category ', validate(createCategorySchema), categoriesController.createCategory);
router.get('/list-all-categories ', categoriesController.getAllCategories);
