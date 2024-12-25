import { Router } from 'express';
import { registerStudent, registerTeacher, login, resetPassword, forgetPassword } from '../controllers/auth.js';
import unauthenticated from '../middleware/unauthenticated.js';



const router = Router();
router.post('/register-student', unauthenticated, registerStudent);
router.post('/forget-password', forgetPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/register-teacher', registerTeacher);
router.post('/login', login); 

export default router;
