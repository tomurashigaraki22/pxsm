import { useAuth } from "../contexts/AuthContext";
import React, { useState, useEffect } from "react";
import CreateSquadClient from "@squadco/js";
import { motion } from "framer-motion";
import { API_URL } from "../config";

export default function WalletFunding({ onFund, onClose }) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // New state for payment status
  const [paymentError, setPaymentError] = useState(null); // New state for payment error
  const [paymentResponse, setPaymentResponse] = useState(null); // New state for payment response
  const { user } = useAuth();


  const handleChange = (e) => {
    const value = e.target.value;
    if (value >= 0) {
      setAmount(value);
      setError("");
    }
  };

  useEffect(() => {
    const handlePaymentCallback = async (event) => {
      console.log("Payment callback received:", event);
      try{
        if (event.data && event.data.type === "squad.payment_successful") {
          setPaymentStatus("success");
          setPaymentResponse(event.data);
          // Call the onFund callback with the payment response
          onFund(Number(amount));
        } else if (event.data && event.data.type === "squad.payment_failed") {
          setPaymentStatus("failed");
          setPaymentError(event.data);
          // Handle payment failure, e.g., show an error message to the user
        }
      } catch(error){
        console.log("Error: ", error)
        setPaymentError("payment successful but failed to update wallet")
      }
    }

    window.addEventListener("message", handlePaymentCallback);
    return () => {
      window.removeEventListener("message", handlePaymentCallback);
    };
  }, [amount, onFund, onClose])

  const handlePayment = async () => {
    setIsLoading(true);
    
    if (!amount || amount < 100) {
        setError("Minimum funding amount is ₦100");
        setIsLoading(false); // Ensure loading stops
        return;
    }

    try {
        const response = await fetch(`https://api-d.squadco.com/transaction/initiate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer sk_7bfd64c7c64b3050602b8ed94ad155ec0ac70607`,
            },
            body: JSON.stringify({
                email: user.email,
                currency: "NGN",
                amount: Number(amount) * 100,
                customer_name: user.username,
                initiate_type: "inline",
                transaction_ref: `wallet_funding_${Date.now()}`,
                callback_url: `${window.location.origin}/payment-callback?transactionRef=wallet_funding_${Date.now()}&amount=${Number(amount)}`,
                payment_channels: ["card", "bank", "ussd", "transfer"],
                pass_charge: true
            })
        });

        const data = await response.json(); // Parse JSON response
        console.log("Data: ", data)
        console.log("Response: ", response)

        if (!response.ok) {
            throw new Error(data.message || "Payment initiation failed");
        }

        // Redirect user to the payment checkout URL
        window.location.href = data.data.checkout_url;
    } catch (error) {
        console.error("Payment error:", error);
        setError(error.message || "Payment failed. Please try again.");
    } finally {
        setIsLoading(false);
    }
};


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
            Fund Your Wallet
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter Amount (₦)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₦</span>
              </div>
              <input
                type="number"
                value={amount}
                onChange={handleChange}
                min="100"
                placeholder="0.00"
                className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
            {error && (
              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Payment Summary</h3>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Amount:</span>
              <span>₦{Number(amount || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>Processing Fee:</span>
              <span>₦0.00</span>
            </div>
            <div className="border-t border-gray-200 mt-2 pt-2">
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>₦{Number(amount || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={!amount || amount < 100}
            className={`w-full py-2 px-4 rounded-md text-white font-medium
              ${amount && amount >= 100
                ? 'bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600'
                : 'bg-gray-300 cursor-not-allowed'
              } transition-all duration-300`}
          >
            {isLoading ? "Processing..." : "Proceed to Payment"}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            By proceeding, you agree to our terms of service and payment processing policies.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}