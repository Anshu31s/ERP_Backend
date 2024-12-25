import { Router } from 'express';
import { createOrder, registerPayment, verifyPayment } from '../controllers/payment.js';

const router = Router();

router.post('/create-order', createOrder);
router.post('/register-payment', registerPayment);
router.post('/verify-payment', verifyPayment);

export default router;