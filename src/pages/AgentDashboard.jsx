import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, DollarSign, Users, TrendingUp, Clock, Banknote } from 'lucide-react';
import { API_URL } from '../config';

export default function AgentDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const [referralCount, setReferralCount] = useState(0); 
  const [detailedOrders, setDetailedOrders] = useState([]);
  const navigate = useNavigate();

  const [withdrawalState, setWithdrawalState] = useState({
    availableBalance: 0,
    withdrawnOrders: [],
    withdrawals: []
  });

  const getWithdrawalDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/agent/withdrawal-details/${localStorage.getItem('agentId')}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch withdrawal details');
      }

      const data = await response.json();
      console.log("Data: ", data)
      setWithdrawalState(data);
    } catch (error) {
      console.error('Error fetching withdrawal details:', error);
    }
  };

  const getAgentOrderDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/agent/orders/${localStorage.getItem('agentId')}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }

      const data = await response.json();
      setDetailedOrders(data.orders);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  
  
  // Dummy data for the agent dashboard
  const [agentData, setAgentData] = useState({
    id: localStorage.getItem('agentId') || 'AG12345',
    totalEarnings: '...',
    pendingWithdrawals: 15000,
    totalReferrals: '...',
    activeReferrals: '...',
    recentReferrals: [
      { id: 1, name: 'John Doe', date: '2023-12-15', amount: 5000, status: 'completed', commission: 200 },
      { id: 2, name: 'Jane Smith', date: '2023-12-14', amount: 3500, status: 'completed', commission: 140 },
      { id: 3, name: 'Mike Johnson', date: '2023-12-12', amount: 7500, status: 'pending', commission: 300 },
    ],  
    withdrawalHistory: [
      { id: 1, amount: 20000, date: '2023-12-10', status: 'completed' },
      { id: 2, amount: 15000, date: '2023-11-25', status: 'completed' },
      { id: 3, amount: 10000, date: '2023-11-10', status: 'completed' },
    ],
    monthlyStats: [
      { month: 'Jan', earnings: 12000 },
      { month: 'Feb', earnings: 15000 },
      { month: 'Mar', earnings: 18000 },
      { month: 'Apr', earnings: 22000 },
      { month: 'May', earnings: 19000 },
      { month: 'Jun', earnings: 25000 },
    ]
  });

  useEffect(() => {
    // Check if user is an agent
    const isAgent = localStorage.getItem('isAgent') === 'true';
    if (!isAgent) {
      navigate('/agent-signup');
    }

    getRefCount();
    getAgentOrderDetails();
    getWithdrawalDetails();
  }, [navigate]);

  const getRefCount = async () => {
    try {
      const response = await fetch(`${API_URL}/agent/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agent_id: localStorage.getItem('agentId'),
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch referral count');
      }
  
      const data = await response.json();
      
      // Calculate total earnings (5% of each order)
      const totalEarnings = data.orders.reduce((total, order) => {
        const commission = order.amount * 0.1; // 5% commission
        return total + commission;
      }, 0);

      console.log("Total Earnings: ", totalEarnings)

      // Add commission to each order
      const ordersWithCommission = data.orders.map(order => ({
        ...order,
        commission: (order.amount * 0.1).toFixed(2) // 5% commission rounded to 2 decimal places
      }));

      console.log("Orders with Commission: ", ordersWithCommission)
  
      setAgentData((prev) => ({
        ...prev,
        totalEarnings: totalEarnings,
        totalReferrals: data.total_orders,
        activeReferrals: data.total_orders,
        recentReferrals: ordersWithCommission.map(order => ({
          id: order.order_id,
          date: order.date.split(' ')[0], // Get just the date part
          amount: parseFloat(order.amount),
          commission: parseFloat(order.commission),
          status: 'completed'
        }))
      }));
    } catch (error) {
      console.error('Error fetching referral count:', error);
    }
  };
  

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/agent-login');
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
                  SocialBoost Agent
                </h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`${
                    activeTab === "overview"
                      ? "border-pink-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("referrals")}
                  className={`${
                    activeTab === "referrals"
                      ? "border-pink-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Referrals
                </button>
                <button
                  onClick={() => setActiveTab("withdrawals")}
                  className={`${
                    activeTab === "withdrawals"
                      ? "border-pink-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Withdrawals
                </button>
              </div>
            </div>

            {/* User Menu - Desktop */}
            <div className="hidden sm:flex items-center">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">Agent ID: {agentData.id}</span>
                <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-500">
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

        {/* Mobile menu */}
        <div className={`sm:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}>
          <div className="pt-2 pb-3 space-y-1">
            <button
              onClick={() => {
                setActiveTab("overview");
                setIsMobileMenuOpen(false);
              }}
              className={`${
                activeTab === "overview"
                  ? "bg-pink-50 border-pink-500 text-pink-700"
                  : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left`}
            >
              Overview
            </button>
            <button
              onClick={() => {
                setActiveTab("referrals");
                setIsMobileMenuOpen(false);
              }}
              className={`${
                activeTab === "referrals"
                  ? "bg-pink-50 border-pink-500 text-pink-700"
                  : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left`}
            >
              Referrals
            </button>
            <button
              onClick={() => {
                setActiveTab("withdrawals");
                setIsMobileMenuOpen(false);
              }}
              className={`${
                activeTab === "withdrawals"
                  ? "bg-pink-50 border-pink-500 text-pink-700"
                  : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left`}
            >
              Withdrawals
            </button>
          </div>

          {/* Mobile user menu */}
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 flex items-center justify-center text-white font-bold">
                  {user?.username?.charAt(0)?.toUpperCase() || "A"}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">Agent ID: {agentData.id}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <button
                onClick={handleLogout}
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
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-pink-100 text-pink-500">
                    <Banknote size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                    <h3 className="text-xl font-bold text-gray-900">₦{agentData.totalEarnings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})}</h3>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-500">
                    <Users size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Referrals</p>
                    <h3 className="text-xl font-bold text-gray-900">{agentData.totalReferrals}</h3>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-500">
                    <TrendingUp size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Active Referrals</p>
                    <h3 className="text-xl font-bold text-gray-900">{agentData.activeReferrals}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Referral ID Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Your Referral ID</h2>
              <div className="bg-gray-50 p-4 rounded-md flex justify-between items-center">
                <span className="font-mono text-lg">{agentData.id}</span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(agentData.id);
                    alert('Referral ID copied to clipboard!');
                  }}
                  className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
                >
                  Copy
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Share this ID with your clients. You'll earn commission on every order they place.
              </p>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Referrals</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {agentData.recentReferrals.map((referral) => (
                      <tr key={referral.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{referral.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₦{referral.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">₦{referral.commission.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            referral.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {referral.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'referrals' && (
          <div className="space-y-6">
            {/* Referral Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Referral Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Referrals</span>
                    <span className="font-medium">{agentData.totalReferrals}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Active Referrals</span>
                    <span className="font-medium">{agentData.activeReferrals}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Conversion Rate</span>
                    <span className="font-medium">{Math.round((agentData.activeReferrals / agentData.totalReferrals) * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Average Commission</span>
                    <span className="font-medium">₦{Math.round(agentData.totalEarnings / agentData.totalReferrals).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Referral ID</h3>
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <p className="font-mono text-sm break-all">{agentData.id}</p>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`${agentData.id}`);
                    alert('Referral ID copied to clipboard!');
                  }}
                  className="w-full px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
                >
                  Copy Referral ID
                </button>
              </div>
            </div>

                        {/* All Referrals */}
                        <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">All Referrals</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {detailedOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.order_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.service_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₦{order.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                          ₦{((parseInt(order.commission) * order.amount)/100).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} ({order.commission.toLocaleString()}%)
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            order.is_paid_agent === 'completed' 
                              ? 'bg-green-100 text-green-800'
                              : order.is_paid_agent === 'processing'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.is_paid_agent === 'completed' ? 'Paid' : order.is_paid_agent === 'processing' ? 'Processing' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'withdrawals' && (
          <div className="space-y-6">
            {/* Withdrawal Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Request Withdrawal</h3>
              <div className="mb-4 p-4 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">Available Balance</p>
                <p className="text-2xl font-bold text-gray-900">₦{withdrawalState.availableBalance.toLocaleString()}</p>
              </div>
              <form className="space-y-4" onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const pendingOrders = detailedOrders.filter(order => 
                    order.is_paid_agent === 'pending'
                  );

                  console.log("Detailed Orders: ", detailedOrders);
                  console.log("Pending Orders: ", pendingOrders);

                  if (pendingOrders.length === 0) {
                    alert('No pending orders available for withdrawal');
                    return;
                  }

                  const formData = {
                    agent_id: localStorage.getItem('agentId'),
                    amount: withdrawalState.availableBalance,
                    bank_name: e.target.bank.value,
                    account_number: e.target.account.value,
                    order_ids: pendingOrders.map(order => order.order_id)
                  };

                  const response = await fetch(`${API_URL}/agent/withdraw`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                  });

                  const data = await response.json();
                  
                  if (data.status === 'success') {
                    alert('Withdrawal request submitted successfully!');
                    getWithdrawalDetails(); // Refresh withdrawal data
                    getAgentOrderDetails(); // Refresh order details
                  } else {
                    throw new Error(data.message);
                  }
                } catch (error) {
                  alert(error.message || 'Failed to submit withdrawal request');
                }
              }}>
                <div>
                  <label htmlFor="bank" className="block text-sm font-medium text-gray-700">
                    Bank
                  </label>
                  <div className="mt-1">
                    <select
                      id="bank"
                      name="bank"
                      required
                      className="py-1 shadow-sm focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="">Select your bank</option>
                      <option value="access">Access Bank</option>
                      <option value="gtb">GTBank</option>
                      <option value="first">First Bank</option>
                      <option value="zenith">Zenith Bank</option>
                      <option value="uba">UBA</option>
                      <option value="kuda">Kuda Bank</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="account" className="block text-sm font-medium text-gray-700">
                    Account Number
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="account"
                      id="account"
                      required
                      className="py-1 shadow-sm focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Enter account number"
                      maxLength="10"
                      pattern="[0-9]{10}"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Orders Included in Withdrawal</h4>
                  <div className="bg-gray-50 p-4 rounded-md max-h-40 overflow-y-auto">
                    {detailedOrders
                      .filter(order => order.is_paid_agent === 'pending')
                      .map(order => (
                        <div key={order.order_id} className="flex justify-between py-1 text-sm">
                          <span className="text-gray-600">Order #{order.order_id.split("_")[2]}</span>
                          <span className="text-gray-900">₦{((parseInt(order.commission) * order.amount)/100).toLocaleString()}</span>
                        </div>
                      ))
                    }
                  </div>
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={withdrawalState.availableBalance <= 0}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {withdrawalState.availableBalance <= 0 ? 'No Funds Available' : 'Request Withdrawal'}
                  </button>
                </div>
              </form>
            </div>
            
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Withdrawal History</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {withdrawalState.withdrawals.map((withdrawal) => (
                      <tr key={withdrawal.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{withdrawal.transaction_reference}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(withdrawal.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₦{withdrawal.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            withdrawal.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : withdrawal.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : withdrawal.status === 'processing'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-red-100 text-red-800'
                          }`}>
                            {withdrawal.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}