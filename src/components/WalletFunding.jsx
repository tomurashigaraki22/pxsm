import { useAuth } from "../contexts/AuthContext";
import React, { useState } from "react";
import { PaystackButton } from "react-paystack";
import { motion } from "framer-motion";
import { API_URL } from "../config";
import { useNavigate } from "react-router-dom";

export default function WalletFunding({ onFund, onClose }) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleChange = (e) => {
    const value = e.target.value;
    if (value >= 0) {
      setAmount(value);
      setError("");
    }
  };

  const config = {
    reference: `wallet_funding_${Date.now()}`,
    email: user.email,
    amount: Number(amount) * 100, // Paystack amount is in kobo
    publicKey: 'pk_test_aa75f665e51af7dd84de924db2bf1c5c1b3bac48',
    metadata: {
      custom_fields: [
        {
          display_name: "Customer Name",
          variable_name: "customer_name",
          value: user.username
        }
      ]
    }
  };

  const onSuccess = async (reference) => {
    try {
      // Update wallet balance
      console.log("PAYMENT WAS SUCCESSFUL")
      navigate(`/payment-callback?transactionRef=${reference}`)
    } catch (error) {
      console.error('Payment verification failed:', error);
      setError('Payment successful but failed to update wallet');
    }
  };

  const componentProps = {
    ...config,
    text: 'Proceed To Payment',
    onSuccess: (reference) => onSuccess(reference),
    onClose: () => onClose()
  }



  // const handlePayment = () => {
    
    
  //   initializePayment(onSuccess(config.reference), onClose);
  // };

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
            disabled={!amount || amount < 100}
            className={`w-full py-2 px-4 rounded-md text-white font-medium
              ${amount && amount >= 100
                ? 'bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600'
                : 'bg-gray-300 cursor-not-allowed'
              } transition-all duration-300`}
          >
            {isLoading ? "Processing..." : <PaystackButton {...componentProps} />}
              
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            By proceeding, you agree to our terms of service and payment processing policies.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}