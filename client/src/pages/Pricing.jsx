import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from "framer-motion"
import axios from "axios"
import { useSelector, useDispatch } from "react-redux"
import { updateCredits } from "../redux/userSlice"
import { serverUrl } from "../App"

// ─── Plans Definition ────────────────────────────────────────
const PLANS = [
    {
        title: "Starter",
        price: 100,
        credits: 300,
        description: "Perfect for quick revisions",
        features: [
            "Generate AI notes",
            "Exam-focused answers",
            "Diagram & charts support",
            "Fast generation"
        ]
    },
    {
        title: "Popular",
        price: 200,
        credits: 700,
        popular: true,
        description: "Best value for students",
        features: [
            "All Starter features",
            "More credits per ₹",
            "Revision mode access",
            "Priority AI response"
        ]
    },
    {
        title: "Pro Learner",
        price: 500,
        credits: 2000,
        description: "For serious exam preparation",
        features: [
            "Maximum credit value",
            "Unlimited revisions",
            "Charts & diagrams",
            "Ideal for full syllabus"
        ]
    }
]

function Pricing() {
    const [selectedPrice, setSelectedPrice] = useState(null)
    const [paying, setPaying] = useState(false)
    const [payingAmount, setPayingAmount] = useState(null)

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { userData } = useSelector((state) => state.user)

    const handlePaying = async (amount, creditsToAdd) => {
        try {
            setPayingAmount(amount)
            setPaying(true)

            // 1. Create order on backend
            const { data } = await axios.post(
                serverUrl + "/api/payment/create-order",
                { amount },
                { withCredentials: true }
            );

            if (!data.success || !data.order) {
                alert("Order creation failed");
                setPaying(false);
                setPayingAmount(null);
                return;
            }

            // 2. Check Razorpay SDK is loaded
            if (typeof window.Razorpay === "undefined") {
                alert("Razorpay SDK not loaded. Please refresh the page.");
                setPaying(false);
                setPayingAmount(null);
                return;
            }

            // 3. Open Razorpay checkout
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_TZx2MSELtEjVu5",
                amount: data.order.amount,
                currency: data.order.currency,
                name: "NotesKaro",
                description: `Buy ${creditsToAdd} Exam Note Credits`,
                order_id: data.order.id,
                handler: async (response) => {
                    try {
                        const verifyRes = await axios.post(
                            serverUrl + "/api/payment/verify-payment",
                            {
                                ...response,
                                userId: userData?._id,
                                creditsToAdd: creditsToAdd
                            },
                            { withCredentials: true }
                        );
                        if (verifyRes.data.success) {
                            // Update credits in Redux store immediately
                            dispatch(updateCredits(verifyRes.data.credits));
                            alert(`Payment Successful! ${creditsToAdd} credits added.`);
                        } else {
                            alert("Payment verification failed.");
                        }
                    } catch (err) {
                        console.error("Verification error:", err);
                        const msg = err?.response?.data?.message || "Verification failed. Please contact support.";
                        alert(`❌ Verification Failed: ${msg}`);
                    }
                    setPaying(false);
                    setPayingAmount(null);
                },
                modal: {
                    ondismiss: () => {
                        alert("Payment cancelled. You were not charged.");
                        setPaying(false);
                        setPayingAmount(null);
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
                setPaying(false);
                setPayingAmount(null);
            });

            rzp.open();

        } catch (error) {
            console.error("💥 Payment Error:", error);
            alert("Payment failed: " + (error?.response?.data?.message || error.message));
            setPaying(false);
            setPayingAmount(null);
        }
    }

    return (
        <div className='min-h-screen bg-gray-100 px-6 py-10 relative'>

            <button onClick={() => navigate("/")} className='flex items-center gap-2 text-gray-600 hover:text-black mb-6'>
                ← Back
            </button>

            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-10"
            >
                <h1 className="text-3xl font-bold">Buy Credits</h1>
                <p className="text-gray-600 mt-2">
                    Choose a plan that fits your study needs
                </p>
                {userData && (
                    <p className="text-sm text-indigo-600 mt-1 font-medium">
                        Current Balance: {userData.credits ?? 0} Credits
                    </p>
                )}
            </motion.div>

            <div className='max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6'>
                {PLANS.map((plan) => (
                    <PricingCard
                        key={plan.title}
                        title={plan.title}
                        price={`₹${plan.price}`}
                        amount={plan.price}
                        credits={`${plan.credits} Credits`}
                        creditsNum={plan.credits}
                        description={plan.description}
                        features={plan.features}
                        popular={plan.popular}
                        selectedPrice={selectedPrice}
                        setSelectedPrice={setSelectedPrice}
                        onBuy={handlePaying}
                        paying={paying}
                        payingAmount={payingAmount}
                    />
                ))}
            </div>

        </div>
    )
}

function PricingCard({
    title,
    price,
    amount,
    credits,
    creditsNum,
    description,
    features,
    popular,
    selectedPrice,
    setSelectedPrice,
    onBuy,
    paying,
    payingAmount
}) {
    const isSelected = selectedPrice === amount;
    const isPayingThisCard = paying && payingAmount === amount;

    return (
        <motion.div
            onClick={() => setSelectedPrice(amount)}
            whileHover={{ y: -4 }}
            className={`
                relative cursor-pointer
                rounded-xl p-6 bg-white
                border transition
                ${isSelected
                    ? "border-black"
                    : popular
                    ? "border-indigo-500"
                    : "border-gray-200"}
            `}
        >
            {popular && !isSelected && (
                <span className='absolute top-4 right-4 text-xs px-2 py-1 rounded bg-indigo-600 text-white'>
                    Popular
                </span>
            )}

            {isSelected && (
                <span className='absolute top-4 right-4 text-xs px-2 py-1 rounded bg-black text-white'>
                    Selected
                </span>
            )}

            <h2 className='text-xl font-semibold'>{title}</h2>
            <p className='text-sm text-gray-500 mt-1'>{description}</p>

            <div className='mt-4'>
                <p className="text-3xl font-bold">{price}</p>
                <p className="text-sm text-indigo-600">{credits}</p>
            </div>

            <button
                disabled={isPayingThisCard}
                onClick={(e) => {
                    e.stopPropagation();
                    onBuy(amount, creditsNum);
                }}
                className={`
                    w-full mt-5 py-2 rounded-lg font-medium transition
                    ${isPayingThisCard
                        ? "bg-gray-300 cursor-not-allowed text-gray-600"
                        : isSelected
                        ? "bg-black text-white"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"}
                `}
            >
                {isPayingThisCard ? "Redirecting..." : "Buy Now"}
            </button>

            <ul className='mt-5 space-y-2 text-sm text-gray-600'>
                {features.map((f, i) => (
                    <li key={i} className="flex gap-2">
                        <span className="text-green-600">✓</span>
                        {f}
                    </li>
                ))}
            </ul>

        </motion.div>
    )
}

export default Pricing