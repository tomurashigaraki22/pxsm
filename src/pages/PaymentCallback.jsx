import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import CreateSquadClient from '@squadco/js';
import { API_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';

export default function PaymentCallback() {
  const [status, setStatus] = useState('verifying');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const transactionRef = searchParams.get('transactionRef');
  const amount = searchParams.get('amount');
  const { user } = useAuth();

  const squad = new CreateSquadClient(
    "sandbox_pk_e61165c5b621a072669088929b3b2e4c14faa3f3ee1c", // Public Key
    "sandbox_sk_e61165c5b621a072669089f6992b4a3b03f7b18e9e1a", // Dummy Private Key
    "development" // Environment (change to 'production' when live)
  );

  const handlePaymentSuccess = async () => {
    try {
      console.log("USER: ", user, " amount: ", amount)
      const response = await fetch(`${API_URL}/balance/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          amount: amount,
          type: 'credit',
          transaction_ref: transactionRef
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update balance');
      }
      const data = await response.json();
      console.log('Balance updated:', data);
    } catch (error) {
      console.error('Failed to update balance:', error);
      // Even if balance update fails, we'll show success since payment was successful
      // But we'll log the error for backend investigation
    }
  };


  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await fetch(`https://api.paystack.co/transaction/verify/${transactionRef}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer sk_live_b1e2e3c5917c1a08f9d0bdf117722916c1fcc5ea`,
            "Content-Type": "application/json",
          },
        })

        const data = await response.json()
        console.log("Verification response:", data)

        // Check if the API call was successful
        if (data.status) {
          // Get the transaction status from data.data.status
          const transactionStatus = data.data.status.toLowerCase()

          switch (transactionStatus) {
            case "success":
              setStatus("success")
              await handlePaymentSuccess()
              setTimeout(() => navigate("/dashboard"), 5000)
              break

            case "pending":
            case "ongoing":
            case "processing":
              setStatus("verifying")
              // Retry verification after 5 seconds
              setTimeout(verifyPayment, 5000)
              break

            case "abandoned":
            case "failed":
            case "reversed":
            case "queued":
              setStatus("failed")
              break

            default:
              setStatus("failed")
          }
        } else {
          // API call was not successful
          console.error("Verification API call failed:", data.message)
          setStatus("failed")
        }
      } catch (error) {
        console.error("Verification failed:", error)
        setStatus("failed")
      }
    }

    if (transactionRef) {
      verifyPayment()
    }
  }, [transactionRef, navigate, handlePaymentSuccess])


  
  

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-lg shadow-md max-w-md w-full"
      >
        {status === 'verifying' && (
            <motion.div 
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="text-center"
            >
                <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 animate-spin"></div>
                <div className="absolute inset-1 rounded-full bg-white"></div>
                <div className="absolute inset-2 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 animate-ping opacity-75"></div>
                <div className="absolute inset-3 rounded-full bg-white"></div>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifying Payment</h2>
                <p className="text-gray-600">Please wait while we verify your payment...</p>
            </motion.div> // <-- This was missing
            )}


        {status === 'success' && (
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring",
              duration: 0.5
            }}
            className="text-center"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ times: [0, 0.6, 1] }}
              className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center"
            >
              <motion.svg 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-8 h-8 text-green-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </motion.svg>
            </motion.div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">Your wallet has been credited. Redirecting...</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-pink-500 to-blue-500 text-white px-6 py-2 rounded-md hover:from-pink-600 hover:to-blue-600"
            >
              Return to Dashboard
            </motion.button>
          </motion.div>
        )}

        {status === 'failed' && (
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring",
              duration: 0.5
            }}
            className="text-center"
          >
            <motion.div 
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 0.5 }}
              className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center"
            >
              <motion.svg 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
                className="w-8 h-8 text-red-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </motion.svg>
            </motion.div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-6">Something went wrong. Please try again.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-pink-500 to-blue-500 text-white px-6 py-2 rounded-md hover:from-pink-600 hover:to-blue-600"
            >
              Return to Dashboard
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}