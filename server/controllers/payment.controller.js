import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../models/user.model.js"; // 👈 Ensure correct relative path to your User model

// Razorpay instance initialization
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order Function
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: Number(amount * 100), // Amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify Payment Function
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, creditsToAdd } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // 1. Logged-in user fallback (if req.user is set via auth middleware or passed in body)
      const targetUserId = userId || req.user?._id;

      if (!targetUserId) {
        return res.status(400).json({ success: false, message: "User ID is required to update credits" });
      }

      // 2. Increment user credits in MongoDB ($inc adds to current credits)
      const creditsAmount = Number(creditsToAdd) || 100; // Default 100 credits if not passed
      const updatedUser = await User.findByIdAndUpdate(
        targetUserId,
        { $inc: { credits: creditsAmount } },
        { new: true }
      );

      return res.status(200).json({ 
        success: true, 
        message: "Payment Verified & Credits Added Successfully!",
        credits: updatedUser.credits 
      });
    } else {
      return res.status(400).json({ success: false, message: "Invalid Signature, Payment Failed" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};