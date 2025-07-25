import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import WalletFunding from '../components/WalletFunding';
import axios from 'axios';
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import SEO from '../components/SEO';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('wallet');
  const [isPlacingOrder, setisPlacingOrder] = useState(false)
  const [agentId, setagentId] = useState("")
  const [isValidAgent, setIsValidAgent] = useState(false)
  const [agentError, setAgentError] = useState('')
  const [isValidatingAgent, setisValidatingAgent] = useState(false)
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(true)
  const { user, logout } = useAuth();
  const navigate = useNavigate()

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
    // Services State
  const [selectedService, setSelectedService] = useState(null);

  const [showPayment, setShowPayment] = useState(false);
  const [fundingAmount, setFundingAmount] = useState(0);
  const [isServicesLoading, setIsServicesLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [filteredServices, setFilteredServices] = useState([]);

  const [orderQuantity, setOrderQuantity] = useState('');
  const [orderLink, setOrderLink] = useState('');
  const [transactions, setTransactions] = useState([])
  const [platforms, setPlatforms] = useState({
    "facebook": "Facebook",
    "instagram": "Instagram",
    "tiktok": "TikTok",
    "youtube": "YouTube",
    "twitter": "Twitter",
    "linkedin": "LinkedIn",
    "reddit": "Reddit",
    "spotify": "Spotify",
    "telegram": "Telegram",
    "quora": "Quora",
    "whatsapp": "WhatsApp",
    "web": "Web Traffic",
    "boomplay": "Boomplay",
  })
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }
  const [orders, setOrders] = useState([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_URL}/orders/${user.id}`);
        const data = await response.json();
        if (response.ok && data.orders) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setIsOrdersLoading(false);
      }
    };

    if (user?.id) {
      fetchOrders();
    }
  }, [user]);

useEffect(() => {
  console.log("Array: ", services)
  if (selectedPlatform && Array.isArray(services)) {
    console.log("ArrayL")
    setFilteredServices(services.filter(service => 
      service.name.toLowerCase().includes(selectedPlatform.toLowerCase())
    ));
  } else if (Array.isArray(services)) {
    setFilteredServices(services);
  } else {
    setFilteredServices([]); 
  }
}, [selectedPlatform, services]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`/api/proxy?action=services`);
        const data = await response.json();
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
        const data = await response.json();
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

  const [walletBalance, setWalletBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  

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
    console.log("Base rate per 1000: ", baseRate)
    console.log("Sel: ", selectedService)
    if (parseInt(baseRate) > 10000){
      return (baseRate * 1.15).toFixed(2); // Multiply by 1.15 and round to 2 decimal places
    }
    return (baseRate * 1.35).toFixed(2); // Multiply by 1.4 and round to 2 decimal places
  };
  const [rate, setRate] = useState(0)
  const handleServiceChange = (event) => {
    const selectedServiceName = event.target.value;
    const serviceDetails = services.find(service => parseFloat(service.service) === parseFloat(selectedServiceName));

    if (serviceDetails) {
      const updatedRate = calculateRateWithProfit(serviceDetails.rate);

      setSelectedService(serviceDetails);
      setRate(updatedRate);
    }
  };
  const handlePlaceOrder = async (service) => {
    setisPlacingOrder(true)
    try {
      console.log("Order tried to place")
      console.log("Service that was placed: ", service)

      if (parseFloat(walletBalance) < ((orderQuantity * (rate / 1000)).toFixed(2))){
        alert("Insufficient funds")
        return
      }

  
      // Create order API call
      const response = await fetch(
        `/api/proxy?action=add&service=${selectedService.service}&link=${orderLink}&quantity=${orderQuantity}&key=ghHzFXqMbTvk8Frq3dii1lnHubpnJwbn`,
        {
          method: "GET", // API uses GET parameters, not POST body
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
  
      if (!response.ok) {
        console.log("Response from order: ", response)
        console.log(`Failed to place order: ${response.status}`)
        const m = await response.json()
        if(m.error){
          console.log(`An error occured: ${m.error}`)
          if (m.error === "insufficient_funds"){
            alert(`Insufficient funds on API, Contact Website Admin`)
            console.log("AMOUNT: ", ((orderQuantity * (rate / 1000) * (isValidAgent ? 0.95 : 1)).toFixed(2)))
            console.log("")
            const response = await fetch(`${API_URL}/orders/create`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                user_id: user.id,
                order_id: `new_order_${Date.now()}`,
                service_name: selectedService.name,
                link: orderLink,
                amount: (orderQuantity * (rate / 1000) * (isValidAgent ? 0.95 : 1)).toFixed(2),
                status: 'cancelled'
              })
            })
            if (!response.ok) {
              console.log("Failed to create order in database")
              return
            }
            console.log("Order created in database")
            navigate("/")
          }
        }
        return
      }
  
      const orderData = await response.json()
      console.log("Order data1: ", orderData)
      if (!orderData.order || orderData.error) {
        console.log("Order data2: ", orderData)
        console.log("Invalid order response from API")
        const response = await fetch(`${API_URL}/orders/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user.id,
            order_id: `new_order_${Date.now()}`,
            service_name: selectedService.name,
            link: orderLink,
            amount: (orderQuantity * (rate / 1000) * (isValidAgent ? 0.95 : 1)).toFixed(2),
            status: 'cancelled'
          })
        })
        if (!response.ok) {
          console.log("Failed to create order in database")
          return
        }
        console.log("Order created in database")
        navigate("/")
        return
      }
  
      console.log("Order created successfully:", orderData)
      const orderNum = orderData.order
  
      // Check order status API call
      const statusResponse = await fetch(
        `/api/proxy?action=status&order=${orderNum}&key=ghHzFXqMbTvk8Frq3dii1lnHubpnJwbn`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
  
      if (!statusResponse.ok) {
        console.log(`Failed to get order status: ${statusResponse.status}`)
      }
  
      const statusData = await statusResponse.json()
      console.log("Order status:", statusData)
  
      // Handle different status responses
      if (statusData.status === "Pending") {const response = await fetch(`${API_URL}/orders/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user.id,
            order_id: orderNum,
            service_name: selectedService.name,
            link: orderLink,
            agentId: agentId,
            amount: (orderQuantity * (rate / 1000) * (isValidAgent ? 0.95 : 1)).toFixed(2),
            status: 'pending'
          })
        })
        if (!response.ok) {
          console.log("Failed to create order in database")
          return
        }
        console.log("Order created in database")
        navigate("/")
        return { success: true, message: "Order is awaiting processing", data: statusData }
      } else if (statusData.status === "In progress") {
        const response = await fetch(`${API_URL}/orders/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user.id,
            agentId: agentId,
            order_id: orderNum,
            service_name: selectedService.name,
            link: orderLink,
            amount: (orderQuantity * (rate / 1000) * (isValidAgent ? 0.95 : 1)).toFixed(2),
            status: 'completing'
          })
        })
        if (!response.ok) {
          console.log("Failed to create order in database")
          return
        }
        console.log("Order created in database")
        navigate("/")
        return { success: true, message: "Order is in progress", data: statusData }
      } else if (statusData.status === "Completed") {
        const response = await fetch(`${API_URL}/orders/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user.id,
            order_id: orderNum,
            service_name: selectedService.name,
            link: orderLink,
            agentId: agentId,
            amount: (orderQuantity * (rate / 1000) * (isValidAgent ? 0.95 : 1)).toFixed(2),
            status: 'completed'
          })
        })
        if (!response.ok) {
          console.log("Failed to create order in database")
          return
        }
        console.log("Order created in database")
        navigate("/")
        return { success: true, message: "Order completed successfully", data: statusData }
      } else if (statusData.status === "Partial") {
        const response = await fetch(`${API_URL}/orders/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user.id,
            order_id: orderNum,
            service_name: selectedService.name,
            link: orderLink,
            agentId: agentId,
            amount: (orderQuantity * (rate / 1000) * (isValidAgent ? 0.95 : 1)).toFixed(2),
            status: 'completing'
          })
        })
        if (!response.ok) {
          console.log("Failed to create order in database")
          return
        }
        console.log("Order created in database")
        navigate("/")
        return { success: true, message: "Order partially completed", data: statusData }
      } else if (statusData.status === "Canceled" || statusData.status === "Fail") {
        const response = await fetch(`${API_URL}/orders/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user.id,
            order_id: orderNum,
            service_name: selectedService.name,
            link: orderLink,
            amount: (orderQuantity * (rate / 1000) * (isValidAgent ? 0.95 : 1)).toFixed(2),
            status: 'cancelled'
          })
        })
        if (!response.ok) {
          console.log("Failed to create order in database")
          return
        }
        console.log("Order created in database")
        navigate("/")
        return { success: false, message: `Order failed: ${statusData.status}`, data: statusData }
      } else {
        return { success: true, message: "Order status received", data: statusData }
      }
    } catch (error) {
      console.error("Error placing order:", error)
      setisPlacingOrder(false)
      const response = await fetch(`${API_URL}/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          order_id: orderNum,
          service_name: selectedService.name,
          link: orderLink,
          amount: (orderQuantity * (rate / 1000) * (isValidAgent ? 0.95 : 1)).toFixed(2),
          status: 'cancelled'
        })
      })
      if (!response.ok) {
        console.log("Failed to create order in database")
        return
      }
      console.log("Order created in database")
      navigate("/")
      return { success: false, message: error.message || "An unknown error occurred" }
    }
    finally{
      setisPlacingOrder(false)
    }
  }


  const validateAgentId = async (id) => {
    setisValidatingAgent(true)
    if (!id){
      setIsValidAgent(false);
      setAgentError("Agent id not sent")
      return
    }

    try {
      const response = await fetch(`${API_URL}/check/${id}`);
      const data = await response.json()

      if (response.ok && data.exists){
        setIsValidAgent(true)
        setAgentError("");
      } else{
        setIsValidAgent(false)
        setAgentError("Invalid agent ID")
      }
    } catch (error) {
      console.log("Error: ", error)
      setIsValidAgent(false)
      setAgentError("Error validating agent id")
    } finally{
      setisValidatingAgent(false)
    }
  }
  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <SEO 
        title="Dashboard"
        description="Boost your social media presence with our premium services. Get real followers, likes, and engagement across all major platforms."
        keywords="social media marketing, followers, likes, engagement, Instagram, Facebook, Twitter, TikTok"/>
        <motion.div 
          className="fixed inset-0 -z-10"
          animate={{
            background: [
              'radial-gradient(circle at 0% 0%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 100% 100%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 100% 0%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
<nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center gap-2">
  <img
    src="/logo.jpg"
    alt="SocialBoost Logo"
    className="w-16 h-16 rounded-full object-cover"
  />

</div>

            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <button
                onClick={() => setActiveTab("wallet")}
                className={`${
                  activeTab === "wallet"
                    ? "border-pink-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Wallet
              </button>
              <button
                onClick={() => setActiveTab("services")}
                className={`${
                  activeTab === "services"
                    ? "border-pink-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Buy Services
              </button>
              <button
                onClick={() => setActiveTab("order_history")}
                className={`${
                  activeTab === "order_history"
                    ? "border-pink-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Order History
              </button>

              
            </div>
          </div>

          {/* User Menu - Desktop */}
          <div className="hidden sm:flex items-center">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">{user?.username}</span>
              <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full flex items-center">
                {isLoading ? (
                  <div className="animate-spin w-4 h-4 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-green-100"></div>
                  </div>
                ) : (
                  `₦${walletBalance?.toLocaleString() ?? "0"}`
                )}
              </span>
              <button onClick={() => logout()} className="text-sm text-red-600 hover:text-red-500">
                Logout
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`sm:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}>
        <div className="pt-2 pb-3 space-y-1">
          <button
            onClick={() => {
              setActiveTab("wallet")
              setIsMobileMenuOpen(false)
            }}
            className={`${
              activeTab === "wallet"
                ? "bg-pink-50 border-pink-500 text-pink-700"
                : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            } block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left`}
          >
            Wallet
          </button>
          <button
            onClick={() => {
              setActiveTab("services")
              setIsMobileMenuOpen(false)
            }}
            className={`${
              activeTab === "services"
                ? "bg-pink-50 border-pink-500 text-pink-700"
                : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            } block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left`}
          >
            Buy Services
          </button>
          <button
            onClick={() => {
              setActiveTab("order_history")
              setIsMobileMenuOpen(false)
            }}
            className={`${
              activeTab === "order_history"
                ? "bg-pink-50 border-pink-500 text-pink-700"
                : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            } block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left`}
          >
            Order History
          </button>
        </div>

        {/* User menu in mobile view */}
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="flex items-center px-4">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 flex items-center justify-center text-white font-bold">
                {user?.username?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-gray-800">{user?.username}</div>
              <div className="text-sm font-medium text-gray-500">
                Balance:{" "}
                {isLoading ? (
                  <span className="inline-block animate-pulse">Loading...</span>
                ) : (
                  `₦${walletBalance?.toLocaleString() ?? "0"}`
                )}
              </div>
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <button
              onClick={() => {
                logout()
                setIsMobileMenuOpen(false)
              }}
              className="block px-4 py-2 text-base font-medium text-red-600 hover:text-red-800 hover:bg-gray-100 w-full text-left"
            >
              Logout
            </button>
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
                    Fund Wallet
                  </button>
                )}
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
                            transaction.type.toLocaleUpperCase() === "CREDIT" ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type.toLocaleUpperCase() === "CREDIT" ? '+' : '-'}₦{Number(transaction.amount).toLocaleString()}
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
        ) : activeTab === 'services'? (
          (
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

           {selectedPlatform && selectedService && (
            <div className="bg-white border-2 border-pink-200 rounded-lg p-6 shadow-sm max-w-3xl mx-auto my-6">
            <div className="space-y-6">
              {/* Header */}
              <div className="border-b border-pink-100 pb-4">
                <h2 className="text-xl font-bold text-gray-900">SERVICE DETAILS (PLEASE READ)</h2>
              </div>
      
              {/* Instagram Settings Warning */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">🚨</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-yellow-800">READ THIS BEFORE YOU ORDER ANY INSTAGRAM FOLLOWER SERVICE</h3>
                    <div className="mt-2 text-yellow-700">
                      <p className="mb-2">Please make the below changes on your Instagram account settings to ensure that Followers ordered are delivered directly to your account. This is because Instagram has automatically turned on "Follower Flagging" for all accounts.</p>
                      <ol className="list-decimal list-inside space-y-1 ml-2">
                        <li>Go to your Account Settings</li>
                        <li>Scroll and locate "Follow & Invite Friends"</li>
                        <li>Locate the "Flag for Review" option and make sure it is UNCHECKED</li>
                        <li>Then you can come back to place order for followers</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
      
              {/* Cheap Services Warning */}
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <h3 className="text-lg font-medium text-red-800 mb-2">❌ Services Under The "Cheap" Category Have No Quality or Refill Guarantees</h3>
                <ul className="list-disc list-inside space-y-2 text-red-700">
                  <li>Cheap services can Unfollow/Drop/Reduce at any time. You may lose some or all your Followers/Engagement. Please be advised.</li>
                  <li>Cheap services are not stable. Your order can get stuck.</li>
                  <li>Please do not ask for a refill or refund if you order Cheap services.</li>
                </ul>
              </div>
      
              {/* Recommended Services */}
              <div className="bg-green-50 border-l-4 border-green-400 p-4">
                <h3 className="text-lg font-medium text-green-800 mb-2">✅ Recommended Services</h3>
                <ul className="list-disc list-inside space-y-2 text-green-700">
                  <li>Use our [Normal Quality] & [Best Quality] Categories for the best service experience and a Refill Guarantee if your Followers or Engagement ever Reduces/Drops.</li>
                  <li>Don't use Cheap category services and Normal/Best Quality services on the same link. The link won't get a Refill Guarantee.</li>
                </ul>
              </div>
      
              {/* Link Format */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <h3 className="text-lg font-medium text-blue-800 mb-2">✅ Link Format & Start Time</h3>
                <div className="space-y-2 text-blue-700">
                  <p>LINK FORMAT: <code className="bg-blue-100 px-2 py-1 rounded">https://instagram.com/yourpageusername</code></p>
                  <p>For Example: <code className="bg-blue-100 px-2 py-1 rounded">https://instagram.com/devtomiwa</code></p>
                  <p>START TIME: 1 - 24 Hours</p>
                </div>
              </div>
      
              {/* Don'ts */}
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <h3 className="text-lg font-medium text-red-800 mb-2">PLEASE DON'T DO THE FOLLOWING:</h3>
                <ul className="list-none space-y-2 text-red-700">
                  <li>❌ DON'T CHANGE YOUR USERNAME while followers are still delivering on your page</li>
                  <li>❌ DON'T SEND FOLLOWERS TO A PRIVATE PAGE. Make sure you make the page Public before sending followers.</li>
                  <li>❌ DON'T ORDER FOLLOWERS FOR THE SAME PAGE TWICE. ENSURE THE FIRST ORDER HAS BEEN COMPLETED BEFORE PLACING ANOTHER FOR THE SAME PAGE ELSE It will lead to incomplete delivery which we won't refund.</li>
                  <li>❌ DON'T USE AN INVITE LINK. Please use only the Link Format stated above.</li>
                </ul>
              </div>
            </div>
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
  <label className="block text-sm font-medium text-gray-700 mb-2">Agent ID</label>
  <input
    type="text"
    value={agentId}
    onChange={(e) => setagentId(e.target.value)}
    onBlur={(e) => validateAgentId(e.target.value)}
    className={`w-full border ${
      agentId && (isValidAgent ? 'border-green-500' : 'border-red-500')
    } rounded-md p-2 focus:ring-pink-500 focus:border-pink-500`}
    placeholder="Enter agent referral"
  />

  {isValidatingAgent && (
    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
      <svg
        className="animate-spin h-4 w-4 text-pink-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      Validating agent...
    </div>
  )}

  {agentError && !isValidatingAgent && (
    <p className="mt-1 text-sm text-red-600">{agentError}</p>
  )}

  {isValidAgent && !isValidatingAgent && (
    <p className="mt-1 text-sm text-green-600">Valid Agent ID</p>
  )}
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
                    <span>₦{rate} per 1000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>₦{(orderQuantity * (rate / 1000)).toLocaleString(undefined, {minimumFractionDigits:2,maximumFractionDigits:2})}</span>
                  </div>
                  {isValidAgent && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Agent Discount (5%):</span>
                      <span>-₦{((orderQuantity * (rate / 1000)) * 0.05).toLocaleString(undefined, {minimumFractionDigits:2,maximumFractionDigits:2})}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold pt-2 border-t border-gray-200">
                    <span>Total Cost:</span>
                    <span>₦{(orderQuantity * (rate / 1000) * (isValidAgent ? 0.95 : 1)).toLocaleString(undefined, {minimumFractionDigits:2,maximumFractionDigits:2})}</span>
                  </div>
                </div>
              </div>
  
              <button
                onClick={() => handlePlaceOrder(selectedService)}
                disabled={!orderQuantity || !orderLink || isPlacingOrder || isValidatingAgent}
                className="w-full bg-gradient-to-r from-pink-500 to-blue-500 text-white py-2 rounded-md hover:from-pink-600 hover:to-blue-600 disabled:opacity-50 mt-4"
              >
                {isPlacingOrder? "Placing Order..." : "Place Order"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
          )
        )
        : (            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Order History</h3>
              </div>
              <div className="overflow-x-auto min-h-[300px] relative">
                {isOrdersLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-12 h-12">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 animate-spin"></div>
                      <div className="absolute inset-1 rounded-full bg-white"></div>
                      <div className="absolute inset-2 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 animate-ping opacity-75"></div>
                      <div className="absolute inset-3 rounded-full bg-white"></div>
                    </div>
                  </div>
                ) : orders.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Link</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order Details</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{order.order_id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.service_name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <a href={order.link} target="_blank" rel="noopener noreferrer" 
                               className="text-blue-500 hover:text-blue-700 truncate max-w-xs block">
                              {order.link}
                            </a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₦{order.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                            onClick={() => navigate("/order-details", { state: { orderData: order } })}
                              className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                            >
                              View Details
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-8 text-gray-500">No orders found</div>
                )}
              </div>
            </div>
          )
        }
        <div className="space-y-6">
          {/* Services Grid */}
        </div>
      </main>
    </div>
  );
}
