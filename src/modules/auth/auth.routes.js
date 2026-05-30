import express from 'express';
import authController from './auth.controller.js';
import auth from '../../middlewares/auth.middleware.js';
import { registerSchema, loginSchema } from './auth.validate.js';
import validate from '../../middlewares/validate.middleware.js';
const router = express.Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', auth, authController.logout);
router.post('/reset-password', authController.resetPassword);
router.post('/forgot-password', authController.forgotPassword);
router.post('/refresh-token', authController.refreshToken);

export default router;