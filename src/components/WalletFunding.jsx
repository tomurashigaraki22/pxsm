import { useAuth } from "../contexts/AuthContext";
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function WalletFunding({ onFund, onClose }) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [showWhatsapp, setShowWhatsapp] = useState(false);
  const { user } = useAuth();

  const handleChange = (e) => {
    const value = e.target.value;
    if (value >= 0) {
      setAmount(value);
      setError("");
    }
  };

  // WhatsApp number and template
  const whatsappNumber = "2347044831729"; // Replace with actual number, e.g. 2348071273078
  const template = `Hello, I have made a wallet funding payment.\n\nName: ${user?.username || ""}\nEmail: ${user?.email || ""}\nAmount: ₦${amount}\nBank: Moniepoint\nAccount Number: 8071273078\nAccount Name: Raphael Tomiwa`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(template)}`;

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
            <h3 className="text-sm font-medium text-gray-700 mb-2">Transfer To</h3>
            <div className="flex flex-col gap-1 text-gray-700 text-base">
              <span><b>Bank:</b> Moniepoint</span>
              <span><b>Account Number:</b> 8071273078</span>
              <span><b>Account Name:</b> Raphael Tomiwa</span>
            </div>
            <div className="mt-2 text-xs text-gray-500">After transfer, click 'I have paid' below and contact us on WhatsApp for faster confirmation (Send Proof Of Payment).</div>
          </div>

          {!showWhatsapp ? (
            <button
              disabled={!amount || amount < 100}
              className={`w-full py-2 px-4 rounded-md text-white font-medium mt-2
                ${amount && amount >= 100
                  ? 'bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600'
                  : 'bg-gray-300 cursor-not-allowed'
                } transition-all duration-300`}
              onClick={() => setShowWhatsapp(true)}
            >
              I have paid
            </button>
          ) : (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block py-2 px-4 rounded-md text-white font-medium mt-2 bg-green-500 hover:bg-green-600 text-center transition-all duration-300"
            >
              Contact on WhatsApp
            </a>
          )}

          <p className="text-xs text-gray-500 text-center mt-4">
            By proceeding, you agree to our terms of service and payment processing policies.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}