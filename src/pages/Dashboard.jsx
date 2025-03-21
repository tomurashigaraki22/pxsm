import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import WalletFunding from '../components/WalletFunding';
import axios from 'axios';
import { API_URL } from '../config';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('wallet');
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(true)
  const { user, logout } = useAuth();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
    // Services State
    const [selectedService, setSelectedService] = useState(null);

    const [showPayment, setShowPayment] = useState(false);
    const [fundingAmount, setFundingAmount] = useState(0);
   // Add these new states at the top
   const [isServicesLoading, setIsServicesLoading] = useState(true);
   const [services, setServices] = useState([]);
   const [selectedPlatform, setSelectedPlatform] = useState(null);
   const [filteredServices, setFilteredServices] = useState(services);

   const [orderQuantity, setOrderQuantity] = useState('');
   const [orderLink, setOrderLink] = useState('');
  const [transactions, setTransactions] = useState([])
  const [platforms, setPlatforms] = useState({
    "facebook": "Facebook",
    "instagram": "Instagram",
    "tiktok": "TikTok",
    "youtube": "YouTube",
  })

  useEffect(() => {
    if (selectedPlatform) {
      console.log("Platform was selected: ", selectedPlatform)
      setFilteredServices(services.filter(service => 
        service.name.toLowerCase().includes(selectedPlatform.toLowerCase())
      ));
      
    } else {
      setFilteredServices(services);
    }
  }, [selectedPlatform, services]);


 
  
  // Add this useEffect to fetch services
  useEffect(() => {
    const fetchServices = async () => {
      const formdata = new FormData()
      formdata.append("key", "yUNY9SCYVkQZIpN1qfge")
      formdata.append("action", "services")
      try {
        const response = await fetch('https://boostsmm.ng/api/v1', {
          method: 'POST',
          body: formdata
        });
        console.log("A: ", response)
        const data = await response.json();
        console.log("AD: ", data)
        setServices(data);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setIsServicesLoading(false);
      }
    };
  
    fetchServices();
  }, []);
  

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`${API_URL}/transactions/${user.id}`);
        console.log("reS: ", response)
        const data = await response.json();
        console.log("Tx Data: ", data)
        if (response.ok && data.transactions) {
          setTransactions(data.transactions);
        }
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setIsTransactionsLoading(false);
      }
    };
  
    if (user?.id) {
      fetchTransactions();
    }
  }, [user]);

  // Wallet State
  // Replace the static wallet balance
  const [walletBalance, setWalletBalance] = useState(0);
  
  // Add this near your other state declarations
  const [isLoading, setIsLoading] = useState(true);
  
  // Update your useEffect
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch(`${API_URL}/balance/get/${user.id}`);
        const data = await response.json();
        if (response.ok) {
          setWalletBalance(data.balance);
        }
      } catch (error) {
        console.error('Failed to fetch balance:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    if (user?.id) {
      fetchBalance();
    }
  }, [user]);
  
  // Replace the balance display with this
  
  
  const handlePaymentSuccess = async (amount) => {
    try {
      const response = await fetch(`${API_URL}/balance/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          amount: amount,
          type: 'credit'
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        // Fetch updated balance
        const balanceResponse = await fetch(`${API_URL}/balance/get/${user.id}`);
        const balanceData = await balanceResponse.json();
        
        if (balanceResponse.ok) {
          setWalletBalance(balanceData.balance);
        }

        // Add to transactions
        const newTransaction = {
          id: Date.now(),
          type: 'Deposit',
          amount: amount,
          date: new Date().toISOString().split('T')[0],
          status: 'Completed'
        };
        
        setTransactions(prev => [newTransaction, ...prev]);
      }
    } catch (error) {
      console.error('Failed to update balance:', error);
    }
    setShowPayment(false);
  };
  



  const handleFundWallet = () => {
    setShowPayment(true);
  };

  const calculateRateWithProfit = (baseRate) => {
    console.log("Calculating base rate and profit: ", baseRate)
    console.log((baseRate * 1.4).toFixed(2))
    return (baseRate * 1.4).toFixed(2); // Multiply by 1.4 and round to 2 decimal places
  };

  const [rate, setRate] = useState(0)

  const handleServiceChange = (event) => {
    console.log("Dropdown changed:", event.target.value); // Debugging log
    const selectedServiceName = event.target.value;
    console.log("SRVICES: ", services)
    const serviceDetails = services.find(service => parseInt(service.service) === parseInt(selectedServiceName));
    console.log("Sel: ", selectedServiceName)
    console.log("SD: ", serviceDetails)
    if (serviceDetails) {
      const updatedRate = calculateRateWithProfit(serviceDetails.rate);
      console.log("Selected service details:", serviceDetails); // Debugging log
      console.log("Updated rate with profit:", updatedRate); // Debugging log
      setSelectedService(serviceDetails);
      setRate(updatedRate);
    }
  };
  

  // Update the handlePaymentSuccess function
  const handlePlaceOrder = async () => {
    try {
      console.log("Order tried to place")
    } catch (error) {
      console.error("Error: ", error)
    }
  }

  const handleAmountChange = (e) => {
    const inputAmount = parseFloat(e.target.value);
    if (!isNaN(inputAmount)) {
      const profitAmount = inputAmount * 1.4;
      setAmount(profitAmount.toFixed(2)); // Round to 2 decimal places for better formatting
    } else {
      setAmount(""); // Reset if input is invalid
    }
  };
  


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
                  SocialBoost
                </h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <button 
                  onClick={() => setActiveTab('wallet')}
                  className={`${
                    activeTab === 'wallet' 
                      ? 'border-pink-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Wallet
                </button>
                <button 
                  onClick={() => setActiveTab('services')}
                  className={`${
                    activeTab === 'services'
                      ? 'border-pink-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Buy Services
                </button>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">{user?.username}</span>
                <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full flex items-center">
                  {isLoading ? (
                    <div className="animate-spin w-4 h-4 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-green-100"></div>
                    </div>
                  ) : (
                    `₦${walletBalance?.toLocaleString() ?? '0'}`
                  )}
                </span>
                <button
                  onClick={() => logout()}
                  className="text-sm text-red-600 hover:text-red-500"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'wallet' ? (
          <div className="space-y-6">
            {/* Wallet Balance Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Wallet Balance</h2>
              <div className="text-4xl font-bold text-green-600">
                {isLoading ? (
                  <div className="animate-spin w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-white"></div>
                  </div>
                ) : (
                  `₦${walletBalance?.toLocaleString() ?? '0'}`
                )}
              </div>
              <div className="mt-4 space-x-4">
                {showPayment ? (
                  <WalletFunding
                    onFund={handlePaymentSuccess}
                    onClose={() => setShowPayment(false)}
                  />
                ) : (
                  <button 
                    onClick={handleFundWallet}
                    className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600"
                  >
                    Add Funds
                  </button>
                )}
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                  Withdraw
                </button>
              </div>
            </motion.div>

            {/* Transaction History */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Transaction History</h3>
              </div>
              <div className="overflow-x-auto min-h-[300px] relative">
                {isTransactionsLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-12 h-12">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 animate-spin"></div>
                      <div className="absolute inset-1 rounded-full bg-white"></div>
                      <div className="absolute inset-2 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 animate-ping opacity-75"></div>
                      <div className="absolute inset-3 rounded-full bg-white"></div>
                    </div>
                  </div>
                ) : transactions.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{transaction.type.toLocaleUpperCase()}</td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                            transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.amount > 0 ? '+' : ''}₦{Number(transaction.amount).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              transaction.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {transaction.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-8 text-gray-500">No transactions found</div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
    {isServicesLoading ? (
      <div className="flex justify-center items-center h-64">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 animate-spin"></div>
          <div className="absolute inset-1 rounded-full bg-white"></div>
          <div className="absolute inset-2 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 animate-ping opacity-75"></div>
          <div className="absolute inset-3 rounded-full bg-white"></div>
        </div>
      </div>
    ) : (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Place New Order</h2>

        {/* Platform Selection */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Select a Platform</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(platforms).map(([key, name]) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedPlatform(key);
                  setSelectedService(null);
                }}
                className={`p-3 rounded-lg border ${
                  selectedPlatform === key ? "border-pink-500 bg-pink-100" : "border-gray-300 hover:bg-gray-100"
                } transition`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Service Selection */}
        {selectedPlatform && (
          <div className="mt-4">
          <label className="block text-gray-700 font-medium mb-2">Select Service</label>
          <select
            value={selectedService ? selectedService.service : ""}
            onChange={(e) => {
              const selectedId = Number(e.target.value);
              const service = filteredServices.find(s => s.service === selectedId);
              if (service) {
                setSelectedService(service);
              }
              console.log("Selected Service:", service); // Debugging
              handleServiceChange(e)
            }}
            className="w-full p-2 border rounded-md"
          >
            <option value="">-- Select a Service --</option>
            {filteredServices.map(service => (
              <option key={service.service} value={service.service}>
                {service.name}
              </option>
            ))}
          </select>
        </div>
         )}

        {selectedService && (
          <>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <input
                type="number"
                min={selectedService.min}
                max={selectedService.max}
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder={`Min: ${selectedService.min} - Max: ${selectedService.max}`}
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Link</label>
              <input
                type="text"
                value={orderLink}
                onChange={(e) => setOrderLink(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Enter your link"
              />
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded-md mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Service:</span>
                  <span>{selectedService.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Rate:</span>
                  <span>₦{rate} per {selectedService.min}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Cost:</span>
                  <span>₦{(orderQuantity * (rate / selectedService.min)).toLocaleString(undefined, {minimumFractionDigits:2,maximumFractionDigits:2})}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={!orderQuantity || !orderLink}
              className="w-full bg-gradient-to-r from-pink-500 to-blue-500 text-white py-2 rounded-md hover:from-pink-600 hover:to-blue-600 disabled:opacity-50 mt-4"
            >
              Place Order
            </button>
          </>
        )}
      </div>
    )}
  </div>
        )}
        <div className="space-y-6">
          {/* Services Grid */}
        </div>
      </main>
    </div>
  );
}
