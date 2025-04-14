import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usePaystackPayment } from 'react-paystack';
import { API_URL } from '../config';
import { Banknote, Calendar, Award, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { PaystackButton } from 'react-paystack';

export default function AgentSubscription() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [subscription, setSubscription] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    setIsLoading(true);
    setError('');
    console.log("AIn")

    try {
      const agentId = localStorage.getItem('agentId');
      setEmail(`${agentId}@gmail.com`)
      
      if (!agentId) {
        setError('Agent ID not found. Please log in again.');
        return;
      }

      const response = await fetch(`${API_URL}/agent/subscription-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_id: agentId,
        }),
      });

      const data = await response.json();
      console.log("Data: ", data)

      if (response.ok) {
        setSubscription(data.subscription);
        
        // If subscription is active, redirect to dashboard
        if (data.subscription.is_active) {
          navigate('/agent-dashboard');
        }
      } else {
        if(data.message === "Agent not found"){
            setError("No subscription status found. Please subscribe to continue using the platform")
        } else{
            setError(data.message || 'Failed to check subscription status');

        }
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
      console.error('Subscription check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

//   const onSuccess = async (reference) => {
//     console.log('Payment successful:', reference);
    
//     try {
//       // Update subscription status in your database
//       const updateResponse = await fetch(`${API_URL}/agent/update-subscription`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           agent_id: localStorage.getItem('agentId'),
//           reference: reference.reference,
//           plan_type: selectedPlan,
//           transaction_id: reference.transaction,
//         }),
//       });

//       if (updateResponse.ok) {
//         navigate('/agent-dashboard');
//       } else {
//         setError('Failed to update subscription. Please contact support.');
//       }
//     } catch (error) {
//       setError('Failed to update subscription. Please contact support.');
//       console.error('Subscription update error:', error);
//     }
//   };

  const onClose = () => {
    setIsProcessing(false);
    console.log('Payment modal closed');
  };

  const config = {
    reference: `sub_${Date.now()}`,
    email: email || '',
    amount: selectedPlan === 'monthly' ? 500000 : 4800000, // Amount in kobo
    publicKey: "pk_test_aa75f665e51af7dd84de924db2bf1c5c1b3bac48",
    metadata: {
      agent_id: localStorage.getItem('agentId'),
      plan_type: selectedPlan,
    },
  };

  const handlePaystackSuccess = async (reference) => {
    try {
        console.log("Reference: ", reference)
      // First, call the subscribe endpoint
      const subscribeResponse = await fetch(`${API_URL}/agent/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_id: localStorage.getItem('agentId'),
          subscription_type: selectedPlan === 'monthly' ? 'basic' : 'premium',
        }),
      });

      if (!subscribeResponse.ok) {
        throw new Error('Failed to activate subscription');
      }

      // Then update the payment status
     

      if (subscribeResponse.ok) {
        navigate('/agent-dashboard');
      } else {
        setError('Failed to update subscription. Please contact support.');
      }
    } catch (error) {
      setError('Failed to update subscription. Please contact support.');
      console.error('Subscription update error:', error);
    }
  };

  const handlePaystackClose = () => {
    setIsProcessing(false);
    console.log('Payment modal closed');
  };

  const componentProps = {
    ...config,
    text: `Subscribe for ${selectedPlan === 'monthly' ? '₦5,000' : '₦48,000'}`,
    onSuccess: (reference) => handlePaystackSuccess(reference),
    onClose: handlePaystackClose,
  };

  const initializePayment = usePaystackPayment(config);

  const handleSubscribe = () => {
    setIsProcessing(true);
    setError('');
    initializePayment(onSuccess, onClose);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-blue-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <SEO 
        title="Become an agent - SocialBoost"
        description="Boost your social media presence with our premium services. Get commissions on referred orders"
        keywords="social media marketing, followers, likes, engagement, Instagram, Facebook, Twitter, TikTok, Agent, Referral"/>
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
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
            SocialBoost
          </h1>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Agent Subscription
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Activate your agent account to start earning commissions
          </p>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {subscription && !subscription.is_active && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="px-6 py-8 bg-pink-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Your Subscription Status</h3>
                <span className="px-3 py-1 text-sm font-medium text-red-800 bg-red-100 rounded-full">
                  Inactive
                </span>
              </div>
              <p className="mt-2 text-gray-600">
                You need an active subscription to access the agent dashboard and earn commissions.
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">Choose a Subscription Plan</h3>
            <p className="mt-2 text-gray-600">
              Select the plan that works best for you and start earning today.
            </p>
          </div>

          <div className="px-6 py-4 flex justify-center space-x-4">
            <button
              onClick={() => setSelectedPlan('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedPlan === 'monthly'
                  ? 'bg-pink-100 text-pink-700 border border-pink-300'
                  : 'text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setSelectedPlan('yearly')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedPlan === 'yearly'
                  ? 'bg-pink-100 text-pink-700 border border-pink-300'
                  : 'text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Yearly (Save 20%)
            </button>
          </div>

          <div className="px-6 py-8">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-gray-900">
                  {selectedPlan === 'monthly' ? 'Monthly Plan' : 'Yearly Plan'}
                </h4>
                <span className="text-2xl font-bold text-gray-900">
                  {selectedPlan === 'monthly' ? '₦5,000' : '₦48,000'}
                </span>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center">
                  <Banknote className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-700">
                    {selectedPlan === 'monthly' ? '10% commission rate' : '10% commission rate'}
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-700">
                    {selectedPlan === 'monthly' ? '30 days access' : '365 days access'}
                  </span>
                </div>
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-700">
                    Priority support
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-700">
                    Faster withdrawals
                  </span>
                </div>
              </div>
              
              <div className={`w-full py-2 px-4 rounded-md text-white font-medium
  ${selectedPlan
    ? 'bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600'
    : 'bg-gray-300 cursor-not-allowed'
  } transition-all duration-300`}
>
  {isProcessing ? (
    "Processing..."
  ) : (
    <PaystackButton 
      {...componentProps}
      className="w-full h-full bg-transparent"
    />
  )}
</div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/dashboard"
            className="text-sm font-medium text-pink-600 hover:text-pink-500"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

// Replace the button with:
