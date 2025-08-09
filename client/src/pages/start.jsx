import React, { useState, useEffect } from 'react';
import { Heart, Shield, Users, Building2, Activity, ChevronRight, CheckCircle, Clock, MapPin, Droplets, Database, FileText, Lock, Globe, Eye } from 'lucide-react';

const BloodManagementSystem = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userType, setUserType] = useState('donor');
  const [connectedWallet, setConnectedWallet] = useState(false);
  const [notifications, setNotifications] = useState(3);

  // Mock data
  const bloodInventory = [
    { type: 'A+', units: 45, demand: 'High', expiry: '5 days' },
    { type: 'O-', units: 12, demand: 'Critical', expiry: '3 days' },
    { type: 'B+', units: 28, demand: 'Medium', expiry: '8 days' },
    { type: 'AB-', units: 7, demand: 'Low', expiry: '12 days' }
  ];

  const recentTransactions = [
    { id: '0x1a2b...', type: 'Donation', donor: 'John D.', bloodType: 'A+', timestamp: '2 hours ago', status: 'Confirmed' },
    { id: '0x3c4d...', type: 'Transfer', from: 'City Blood Bank', to: 'General Hospital', bloodType: 'O-', timestamp: '4 hours ago', status: 'In Transit' },
    { id: '0x5e6f...', type: 'Usage', hospital: 'Children\'s Hospital', bloodType: 'B+', timestamp: '6 hours ago', status: 'Used' }
  ];

  const donationHistory = [
    { date: '2024-07-15', location: 'City Blood Bank', bloodType: 'A+', status: 'Used', recipient: 'Emergency Surgery', txHash: '0xabc...def' },
    { date: '2024-06-10', location: 'University Campus', bloodType: 'A+', status: 'In Use', recipient: 'Pending', txHash: '0x123...456' },
    { date: '2024-05-05', location: 'Community Center', bloodType: 'A+', status: 'Stored', recipient: 'Available', txHash: '0x789...xyz' }
  ];

  const connectWallet = () => {
    setConnectedWallet(true);
  };

  const getDemandColor = (demand) => {
    switch(demand) {
      case 'Critical': return 'text-red-600 bg-red-50';
      case 'High': return 'text-orange-600 bg-orange-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const renderHeader = () => (
    <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Heart className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">BloodChain</h1>
            <p className="text-red-100">Blockchain Blood Management</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <select 
            className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/70"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
          >
            <option value="donor" className="text-gray-800">Donor</option>
            <option value="bloodbank" className="text-gray-800">Blood Bank</option>
            <option value="hospital" className="text-gray-800">Hospital</option>
          </select>
          
          <div className="relative">
            <div className="p-2 bg-white/20 rounded-lg cursor-pointer">
              <Activity className="w-6 h-6" />
            </div>
            {notifications > 0 && (
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-red-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {notifications}
              </div>
            )}
          </div>
          
          <button
            onClick={connectWallet}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              connectedWallet 
                ? 'bg-green-500 text-white' 
                : 'bg-white text-red-600 hover:bg-gray-50'
            }`}
          >
            {connectedWallet ? '✓ Connected' : 'Connect Wallet'}
          </button>
        </div>
      </div>
      
      <div className="flex space-x-1 bg-white/10 rounded-lg p-1">
        {['dashboard', 'inventory', 'transactions', 'profile'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md font-medium capitalize transition-all ${
              activeTab === tab 
                ? 'bg-white text-red-600' 
                : 'text-white hover:bg-white/20'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="p-6 space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Donations</p>
              <p className="text-2xl font-bold text-gray-800">1,247</p>
            </div>
            <Heart className="w-10 h-10 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Blood Banks</p>
              <p className="text-2xl font-bold text-gray-800">23</p>
            </div>
            <Building2 className="w-10 h-10 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Lives Saved</p>
              <p className="text-2xl font-bold text-gray-800">892</p>
            </div>
            <Shield className="w-10 h-10 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Blockchain TXs</p>
              <p className="text-2xl font-bold text-gray-800">3,456</p>
            </div>
            <Database className="w-10 h-10 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Technology Stack Showcase */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-blue-600" />
          Blockchain Technology Stack
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Database className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-800">Ethereum</h4>
            <p className="text-sm text-gray-600">Smart Contracts</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Globe className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-800">IPFS</h4>
            <p className="text-sm text-gray-600">Decentralized Storage</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Lock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-800">MongoDB</h4>
            <p className="text-sm text-gray-600">Encrypted Data</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <FileText className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-800">MERN Stack</h4>
            <p className="text-sm text-gray-600">Full-Stack App</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-red-600" />
          Recent Blockchain Activity
        </h3>
        <div className="space-y-3">
          {recentTransactions.map((tx, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium">{tx.type} - {tx.bloodType}</p>
                  <p className="text-sm text-gray-600">{tx.donor || tx.from || tx.hospital} • {tx.timestamp}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  tx.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                  tx.status === 'In Transit' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {tx.status}
                </span>
                <button className="text-blue-600 hover:text-blue-800">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Droplets className="w-5 h-5 mr-2 text-red-600" />
          Blood Inventory Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {bloodInventory.map((blood, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-xl font-bold text-gray-800">{blood.type}</h4>
                  <p className="text-2xl font-bold text-red-600">{blood.units} units</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="space-y-2">
                <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDemandColor(blood.demand)}`}>
                  {blood.demand} Demand
                </div>
                <p className="text-sm text-gray-600 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Expires in {blood.expiry}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {userType === 'donor' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Heart className="w-5 h-5 mr-2 text-red-600" />
            Schedule Donation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Blood Bank</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>City Blood Bank</option>
                  <option>University Hospital Blood Center</option>
                  <option>Community Health Center</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>
              <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                Schedule Donation
              </button>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">Donation Benefits</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Full blockchain traceability</li>
                <li>• Real-time impact tracking</li>
                <li>• Immutable donation records</li>
                <li>• Community recognition</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderTransactions = () => (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Database className="w-5 h-5 mr-2 text-blue-600" />
            Blockchain Transactions
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live on Ethereum</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Transaction Hash</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Blood Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Timestamp</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((tx, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">{tx.id}</code>
                  </td>
                  <td className="py-3 px-4">{tx.type}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center">
                      <Droplets className="w-4 h-4 text-red-600 mr-1" />
                      {tx.bloodType}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{tx.timestamp}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tx.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                      tx.status === 'In Transit' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-800 flex items-center">
                      View <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="p-6 space-y-6">
      {userType === 'donor' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            My Donation History
          </h3>
          <div className="space-y-4">
            {donationHistory.map((donation, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-medium text-gray-800">{donation.date}</p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {donation.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center mb-1">
                      <Droplets className="w-4 h-4 text-red-600 mr-1" />
                      <span className="font-medium">{donation.bloodType}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      donation.status === 'Used' ? 'bg-green-100 text-green-800' :
                      donation.status === 'In Use' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {donation.status}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    <strong>Impact:</strong> {donation.recipient}
                  </p>
                  <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                    <Database className="w-4 h-4 mr-1" />
                    View on Blockchain
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Lock className="w-5 h-5 mr-2 text-green-600" />
          Privacy & Security
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium">Personal Data Encrypted</span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium">IPFS Document Storage</span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium">Blockchain Verified</span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Data Protection</h4>
            <p className="text-sm text-blue-700">
              Your personal information is encrypted and stored off-chain in MongoDB, 
              while only verification hashes and metadata are stored on the Ethereum blockchain.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return renderDashboard();
      case 'inventory': return renderInventory();
      case 'transactions': return renderTransactions();
      case 'profile': return renderProfile();
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderHeader()}
      {renderContent()}
    </div>
  );
};

export default BloodManagementSystem;