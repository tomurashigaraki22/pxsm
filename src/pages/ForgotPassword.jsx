import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import { Eye, EyeOff } from 'lucide-react';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: email, 2: otp + new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }
      
      setSuccess('OTP sent to your email successfully');
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Validate password length
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          otp, 
          new_password: newPassword 
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }
      
      setSuccess('Password reset successfully! Redirecting to login...');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep(1);
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {step === 1 ? 'Reset your password' : 'Enter OTP & New Password'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {step === 1 ? (
              <>
                Or{' '}
                <Link to="/login" className="font-medium text-pink-600 hover:text-pink-500">
                  return to sign in
                </Link>
              </>
            ) : (
              <>
                Enter the 6-digit code sent to your email and your new password
              </>
            )}
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{success}</span>
          </div>
        )}
        
        {step === 1 ? (
          <form className="mt-8 space-y-6" onSubmit={handleEmailSubmit}>
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handlePasswordReset}>
            <div className="space-y-4">
              <div>
                <label htmlFor="otp" className="sr-only">OTP</label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  maxLength="6"
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm text-center tracking-widest"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                />
              </div>
              
              <div>
                <label htmlFor="newPassword" className="sr-only">New Password</label>
                <div className="border border-gray-300 flex flex-row items-center justify-between pr-3 focus-within:ring-pink-500 focus-within:border-pink-500 rounded-lg">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-0 focus:border-0 sm:text-sm"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  {showPassword ? (
                    <EyeOff color="grey" size={20} className="cursor-pointer" onClick={() => setShowPassword(!showPassword)}/>
                  ) : (
                    <Eye color="grey" size={20} className="cursor-pointer" onClick={() => setShowPassword(!showPassword)}/>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="sr-only">Confirm New Password</label>
                <div className="border border-gray-300 flex flex-row items-center justify-between pr-3 focus-within:ring-pink-500 focus-within:border-pink-500 rounded-lg">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-0 focus:border-0 sm:text-sm"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {showConfirmPassword ? (
                    <EyeOff color="grey" size={20} className="cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}/>
                  ) : (
                    <Eye color="grey" size={20} className="cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}/>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleBackToEmail}
                className="flex-1 py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}