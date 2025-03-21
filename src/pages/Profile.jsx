import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+234 123 456 7890',
    country: 'Nigeria',
    joinDate: 'March 2024',
    totalOrders: 45,
    successRate: '98.5%',
    profileImage: '/avatar-placeholder.jpg' // Add a placeholder image to your public folder
  });

  const socialAccounts = [
    { platform: 'Instagram', username: '@johndoe', isVerified: true },
    { platform: 'TikTok', username: '@johndoe.ng', isVerified: true },
    { platform: 'Twitter', username: '@johndoe_', isVerified: false }
  ];

  const recentActivity = [
    { type: 'Order', description: 'Purchased 1000 Instagram Followers', date: '2 hours ago' },
    { type: 'Login', description: 'New login from Lagos', date: '1 day ago' },
    { type: 'Order', description: 'Purchased 5000 TikTok Views', date: '3 days ago' },
    { type: 'Profile', description: 'Updated profile picture', date: '1 week ago' }
  ];

  const handleSaveProfile = () => {
    setIsEditing(false);
    // Add save logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center">
                  <div className="relative inline-block">
                    <img
                      src={profileData.profileImage}
                      alt="Profile"
                      className="h-32 w-32 rounded-full border-4 border-pink-100"
                    />
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 bg-pink-500 text-white p-2 rounded-full shadow-lg">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-gray-900">{profileData.name}</h2>
                  <p className="text-gray-500">Member since {profileData.joinDate}</p>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="mt-4 px-4 py-2 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-lg hover:from-pink-600 hover:to-blue-600 transition-all"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <button
                      onClick={handleSaveProfile}
                      className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                    >
                      Save Changes
                    </button>
                  )}
                </div>

                <div className="mt-6 border-t border-gray-200 pt-6">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-500">Total Orders</p>
                      <p className="mt-1 text-xl font-semibold text-gray-900">{profileData.totalOrders}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Success Rate</p>
                      <p className="mt-1 text-xl font-semibold text-gray-900">{profileData.successRate}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900">Connected Accounts</h3>
                  <div className="mt-4 space-y-4">
                    {socialAccounts.map((account, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-gray-900">{account.platform}</span>
                          <span className="ml-2 text-sm text-gray-500">{account.username}</span>
                        </div>
                        {account.isVerified ? (
                          <span className="text-green-500">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </span>
                        ) : (
                          <button className="text-sm text-pink-500 hover:text-pink-600">Verify</button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Feed and Details */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow">
                <div className="border-b border-gray-200">
                  <nav className="flex -mb-px">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`px-6 py-4 text-sm font-medium ${
                        activeTab === 'profile'
                          ? 'border-b-2 border-pink-500 text-pink-600'
                          : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Profile Details
                    </button>
                    <button
                      onClick={() => setActiveTab('activity')}
                      className={`px-6 py-4 text-sm font-medium ${
                        activeTab === 'activity'
                          ? 'border-b-2 border-pink-500 text-pink-600'
                          : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Recent Activity
                    </button>
                  </nav>
                </div>

                <div className="p-6">
                  {activeTab === 'profile' ? (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input
                              type="text"
                              disabled={!isEditing}
                              value={profileData.name}
                              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 disabled:bg-gray-100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                              type="email"
                              disabled={!isEditing}
                              value={profileData.email}
                              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 disabled:bg-gray-100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input
                              type="tel"
                              disabled={!isEditing}
                              value={profileData.phone}
                              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 disabled:bg-gray-100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Country</label>
                            <input
                              type="text"
                              disabled={!isEditing}
                              value={profileData.country}
                              onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 disabled:bg-gray-100"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
                      <div className="flow-root">
                        <ul className="-mb-8">
                          {recentActivity.map((activity, index) => (
                            <li key={index}>
                              <div className="relative pb-8">
                                {index !== recentActivity.length - 1 && (
                                  <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                                )}
                                <div className="relative flex space-x-3">
                                  <div>
                                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                      activity.type === 'Order' ? 'bg-pink-500' : 'bg-blue-500'
                                    }`}>
                                      {activity.type === 'Order' ? (
                                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                      ) : (
                                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                      )}
                                    </span>
                                  </div>
                                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                    <div>
                                      <p className="text-sm text-gray-500">{activity.description}</p>
                                    </div>
                                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                      <time dateTime={activity.date}>{activity.date}</time>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 