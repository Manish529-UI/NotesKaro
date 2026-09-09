import React, { useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { updateCredits } from "../redux/userSlice";
import { serverUrl } from "../App";

const BuyCredits = ({ amount = 99, credits = 100 }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  const handlePayment = async () => {
    try {
      setLoading(true);

      // 1. Create order on backend
      const { data } = await axios.post(
        serverUrl + "/api/payment/create-order",
        { amount },
        { withCredentials: true }
      );

      if (!data.success || !data.order) {
        alert("Order creation failed");
        setLoading(false);
        return;
      }

      // 2. Check Razorpay SDK is loaded
      if (typeof window.Razorpay === "undefined") {
        alert("Razorpay SDK not loaded. Please refresh the page.");
        setLoading(false);
        return;
      }

      // 3. Razorpay popup configuration
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_TZx2MSELtEjVu5",
        amount: data.order.amount,
        currency: data.order.currency,
        name: "NotesKaro",
        description: `Buy ${credits} Exam Note Credits`,
        order_id: data.order.id,
        handler: async (response) => {
          try {
            const verifyRes = await axios.post(
              serverUrl + "/api/payment/verify-payment",
              {
                ...response,
                userId: userData?._id,
                creditsToAdd: credits
              },
              { withCredentials: true }
            );
            if (verifyRes.data.success) {
              dispatch(updateCredits(verifyRes.data.credits));
              alert(`Payment Successful! ${credits} credits added.`);
            } else {
              alert("Payment verification failed.");
            }
          } catch (err) {
            console.error("Verification error:", err);
            const msg = err?.response?.data?.message || "Verification failed. Please contact support.";
            alert(`❌ Verification Failed: ${msg}`);
          }
          setLoading(false);
        },
        modal: {
          ondismiss: () => {
            alert("Payment cancelled. You were not charged.");
            setLoading(false);
          },
        },
        prefill: {
          name: userData?.name || "",
          email: userData?.email || "",
        },
        theme: { color: "#4F46E5" },
      };

      const rzp = new window.Razorpay(options);

      // Handle payment failures (bank decline, wrong OTP, network issues)
      rzp.on("payment.failed", (response) => {
        console.error("💳 Payment failed:", response.error);
        alert(
          `Payment Failed: ${response.error.description || "Unknown error"}\n` +
          `Reason: ${response.error.reason || "N/A"}\n` +
          `Code: ${response.error.code || "N/A"}`
        );
        setLoading(false);
      });

      rzp.open();
    } catch (error) {
      console.error("💥 Payment Error:", error);
      alert("Payment failed: " + (error?.response?.data?.message || error.message));
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className={`font-semibold px-5 py-2.5 rounded-lg shadow transition ${
        loading
          ? "bg-gray-400 cursor-not-allowed text-gray-200"
          : "bg-indigo-600 text-white hover:bg-indigo-700"
      }`}
    >
      {loading ? "Processing..." : `Buy Credits (₹${amount})`}
    </button>
  );
};

export default BuyCredits;