import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';
import { API_URL } from '../config';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
const [showInfoModal, setShowInfoModal] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  // Add bank info state
  const [bankInfo, setBankInfo] = useState({
    bankName: 'Sterling Bank',
    accountNumber: '8520692234',
    accountName: 'Tomiwa Raphael FLW'
  });

  // Update the data state structure to match backend
  const [data, setData] = useState({
    users: [],
    agents: [],
    orders: [],
    withdrawals: [],
    metrics: {
      dailyOrders: [],
      monthlyRevenue: []
    }
  });

  // Update fetchData to match backend response structure
  const fetchData = async () => {
    try {
      const responses = await Promise.all([
        fetch(`${API_URL}/admin/users`),
        fetch(`${API_URL}/admin/agents`),
        fetch(`${API_URL}/admin/orders`),
        fetch(`${API_URL}/admin/withdrawals`),
        fetch(`${API_URL}/admin/metrics`)
      ]);

      const [users, agents, orders, withdrawals, metrics] = await Promise.all(
        responses.map(res => res.json())
      );

      setData({
        users,
        agents,
        orders,
        withdrawals,
        metrics
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'Pityboy@22') {
      setIsAuthenticated(true);
      fetchData();
    } else {
      alert('Invalid password');
    }
  };

  const handleWithdrawalStatus = async (withdrawalId, status) => {
    try {
      const response = await fetch(`${API_URL}/admin/withdrawals/${withdrawalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        fetchData(); // Refresh data
        alert('Withdrawal status updated successfully');
      }
    } catch (error) {
      console.error('Error updating withdrawal:', error);
      alert('Failed to update withdrawal status');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Admin Panel</h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <input type="hidden" name="remember" value="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  type="password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
            <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    {['dashboard', 'users', 'agents', 'orders', 'withdrawals'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`${
                      activeTab === tab
                        ? 'border-pink-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium capitalize`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            
            <div className="sm:hidden flex items-center">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
        >
          <span className="sr-only">Open main menu</span>
          {isMobileMenuOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>
    </div>
  </div>

  {/* Mobile menu */}
  {isMobileMenuOpen && (
    <div className="sm:hidden">
      <div className="pt-2 pb-3 space-y-1">
        {['dashboard', 'users', 'agents', 'orders', 'withdrawals'].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setIsMobileMenuOpen(false);
            }}
            className={`${
              activeTab === tab
                ? 'bg-pink-50 border-pink-500 text-pink-700'
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
            } block pl-3 pr-4 py-2 border-l-4 text-base font-medium capitalize w-full text-left`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  )}
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-4">Daily Orders</h3>
                <ResponsiveContainer width="100%" height={300}>
                <BarChart width={500} height={300} data={data.metrics.dailyOrders}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#ec4899" />
                </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-4">Monthly Revenue</h3>
                <ResponsiveContainer width='100%' height={300}>
                <LineChart width={500} height={300} data={data.metrics.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="amount" stroke="#ec4899" />
                </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium">Users</h3>
              <div className="mt-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.users.map(user => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.username}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₦{user.balance.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.is_agent ? 'Agent' : 'User'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium">Agents</h3>
              <div className="mt-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subscription</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Orders</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Earnings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.agents.map(agent => {
                      // Calculate total earnings (4% commission on each order)
                      const agentOrders = data.orders.filter(order => order.agent_id === agent.agent_id);
              const totalEarnings = agentOrders.reduce((total, order) => {
                const commission = order.amount * 0.04; // 4% commission
                return total + commission;
              }, 0);

              // Calculate pending earnings
              const pendingEarnings = agentOrders.reduce((total, order) => {
                if (order.is_paid_agent === 'pending') {
                  const commission = order.amount * 0.04;
                  return total + commission;
                }
                return total;
              }, 0);

                      
                      return (
                        <tr key={agent.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{agent.agent_id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{agent.username}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.subscription_type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.orders?.length || 0}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₦{totalEarnings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium">Orders</h3>
              <div className="mt-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.orders.map(order => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.order_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₦{order.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            order.status === 'completed' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
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

{showInfoModal && selectedWithdrawal && (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 className="text-lg font-medium mb-4">Withdrawal Details</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Agent ID</p>
              <p className="text-base">{selectedWithdrawal.agent_id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Bank Name</p>
              <p className="text-base">{selectedWithdrawal.bank_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Account Name</p>
              <p className="text-base">{selectedWithdrawal.account_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Account Number</p>
              <p className="text-base">{selectedWithdrawal.account_number}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Amount</p>
              <p className="text-base">₦{selectedWithdrawal.amount.toLocaleString()}</p>
            </div>
          </div>
          <button
            onClick={() => setShowInfoModal(false)}
            className="mt-6 w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700"
          >
            Close
          </button>
        </div>
      </div>
    )}

            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium">Pending Withdrawals</h3>
                <div className="mt-4">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {data.withdrawals
                        .filter(w => w.status === 'pending')
                        .map(withdrawal => (
                          <tr key={withdrawal.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {withdrawal.transaction_reference}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{withdrawal.agent_id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ₦{withdrawal.amount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(withdrawal.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleWithdrawalStatus(withdrawal.id, 'approved')}
                        className="text-green-600 hover:text-green-900 mr-4"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          setSelectedWithdrawal(withdrawal);
                          setShowInfoModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Info
                      </button>
                    </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium">All Withdrawals</h3>
                <div className="mt-4">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {data.withdrawals.map(withdrawal => (
                        <tr key={withdrawal.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {withdrawal.transaction_reference}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{withdrawal.agent_id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₦{withdrawal.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              withdrawal.status === 'completed' 
                                ? 'bg-green-100 text-green-800'
                                : withdrawal.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-blue-100 text-blue-800'
                            }`}>
                              {withdrawal.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(withdrawal.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
  // Add bank info section to dashboard
  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-medium mb-4">SMM API Payment Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Bank Name</p>
            <p className="text-lg font-medium">{bankInfo.bankName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Account Number</p>
            <p className="text-lg font-medium">{bankInfo.accountNumber}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Existing charts */}
      </div>
    </div>
  );

  // Update table columns to match backend data
  const renderUsers = () => (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium">Users</h3>
        <div className="mt-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.users.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₦{user.balance.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.is_agent ? 'Agent' : 'User'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Update agents table
  const renderAgents = () => (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium">Agents</h3>
        <div className="mt-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subscription</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Earnings</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pending</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.agents.map(agent => (
                <tr key={agent.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{agent.agent_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{agent.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.subscription_type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₦{agent.total_earnings.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₦{agent.pending_earnings.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Update withdrawals section to include bank details
  const renderWithdrawals = () => (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium">Pending Withdrawals</h3>
          <div className="mt-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.withdrawals
                  .filter(w => w.status === 'pending')
                  .map(withdrawal => (
                    <tr key={withdrawal.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{withdrawal.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₦{withdrawal.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{withdrawal.bank_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{withdrawal.account_number}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(withdrawal.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleWithdrawalStatus(withdrawal.id, 'approved')}
                          className="text-green-600 hover:text-green-900 mr-4"
                        >
                          Approve
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}