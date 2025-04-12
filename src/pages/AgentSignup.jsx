import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../config';

export default function AgentSignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
  
    try {
      // Call the agent signup endpoint
      const response = await fetch(`${API_URL}/auth/agent-signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Success case
        setSuccess(data.message || 'Successfully registered as an agent!');
        
        // Store agent status in localStorage
        localStorage.setItem('isAgent', 'true');
        localStorage.setItem('agentId', data.user.agent_id);
  
        // Redirect to subscription page after 2 seconds
        setTimeout(() => {
          navigate('/agent-subscription');
        }, 2000);
      } else {
        // Handle different error cases based on status codes
        switch (response.status) {
          case 400:
            setError(data.message || 'Invalid request. Please check your information.');
            break;
          case 401:
            setError('Invalid credentials. Please check your email and password.');
            break;
          case 404:
            setError('User does not exist. Please sign up as a regular user first.');
            break;
          default:
            setError(data.message || 'An error occurred. Please try again.');
        }
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
      console.error('Agent signup error:', error);
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
          Become an Agent
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Earn commissions by referring users to our platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Use the same email you registered with as a user
              </p>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Enter your user account password
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : 'Register as Agent'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already an agent?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/agent-login"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                Log in as Agent
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