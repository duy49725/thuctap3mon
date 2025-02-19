import express, {Router} from 'express';
import AuthController from '@controllers/auth/authController';
import authMiddleware from 'src/middleware/authMiddleware';

const router: Router = express.Router();

router.post('/register', AuthController.Register.bind(AuthController));
router.post('/login', AuthController.Login.bind(AuthController));
router.post('/logout', AuthController.Logout.bind(AuthController));
router.get('/check-auth', authMiddleware, AuthController.CheckAuth.bind(AuthController));
router.post('/loginGoogle', AuthController.LoginGoogle.bind(AuthController));

export default router;