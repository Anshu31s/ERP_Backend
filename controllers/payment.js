import Razorpay from 'razorpay';
import crypto from 'crypto';
import payment from '../models/razorpay.js';

const razorpay = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET
});

const createOrder = (req, res) => {
  const { amount, currency = 'INR' } = req.body;

  if (!amount) {
    return res.status(400).json({ message: 'Amount is required' });
  }

  const options = {
    amount: amount * 100,
    currency: currency,
    receipt: `order_rcptid_${Date.now()}`,
    payment_capture: 1
  };

  razorpay.orders.create(options, (err, order) => {
    if (err) {
      return res.status(500).json({ message: 'Error creating order', error: err });
    }
    res.status(200).json({ order });
  });
};

const verifyPayment = (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ message: 'Missing required payment fields' });
  }

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  if (expectedSignature === razorpay_signature) {
    return res.status(200).json({ message: "Payment verified successfully" });
  } else {
    return res.status(400).json({ message: "Payment verification failed" });
  }
};

const registerPayment = async (req, res) => {
  const { paymentId, orderId, signature, name, email, mobile } = req.body;

  if (!paymentId || !orderId || !signature || !name || !email || !mobile) {
    return res.status(400).json({ message: 'Missing required payment fields' });
  }

  try {
    const newPayment = new payment({
      paymentId,
      orderId,
      signature,
      name,
      email,
      mobile,
    });

    await newPayment.save();

    res.status(201).json({ message: 'Payment registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering payment', error: error.message });
  }
};
export { createOrder, verifyPayment, registerPayment };
