import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../config';
import { EyeIcon, EyeOff } from 'lucide-react';

export default function AgentLogin() {
  const [agentId, setAgentId] = useState('');
  const [password, setPassword] = useState('');
  const [eyeOpen, seteyeOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Call the agent login endpoint
      const response = await fetch(`${API_URL}/auth/agent-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_id: agentId,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success case
        // Store agent information in localStorage
        localStorage.setItem('isAgent', 'true');
        localStorage.setItem('agentId', data.agent.agent_id);
        localStorage.setItem('agentData', JSON.stringify(data.agent));
        
        // Check if subscription is valid
        if (data.agent.subscription_valid) {
          // If subscription is valid, redirect to agent dashboard
          navigate('/agent-dashboard');
        } else {
          // If subscription is not valid, redirect to subscription page
          navigate('/agent-subscription');
        }
      } else {
        // Handle different error cases based on status codes
        switch (response.status) {
          case 400:
            setError(data.message || 'Agent ID and password are required.');
            break;
          case 401:
            setError('Invalid agent credentials. Please check your Agent ID and password.');
            break;
          default:
            setError(data.message || 'An error occurred. Please try again.');
        }
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
      console.error('Agent login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
          SocialBoost
        </h1>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Agent Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Access your agent dashboard and manage your referrals
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="agentId" className="block text-sm font-medium text-gray-700">
                Agent ID
              </label>
              <div className="mt-1">
                <input
                  id="agentId"
                  name="agentId"
                  type="text"
                  required
                  value={agentId}
                  onChange={(e) => setAgentId(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                  placeholder="Enter your Agent ID"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 flex flex-row items-center justify-between appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"              >
                <input
                  id="password"
                  name="password"
                  type={eyeOpen? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
                {eyeOpen ? (<EyeOff color='black' onClick={() => seteyeOpen(!eyeOpen)}/>) : (<EyeIcon color='black' onClick={() => seteyeOpen(!eyeOpen)}/>)}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
              >
                {isLoading ? 'Logging in...' : 'Log in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Not an agent yet?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/agent-signup"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                Sign up as Agent
              </Link>
            </div>
            
            <div className="mt-4">
              <Link
                to="/dashboard"
                className="w-full flex justify-center py-2 px-4 text-sm font-medium text-pink-600 hover:text-pink-500"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}