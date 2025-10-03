import React, { useState, useEffect } from 'react';
import { AlertCircle, Droplet, MapPin, Clock, Users, Activity, TrendingUp, Bell, Navigation, Heart, Shield, ChevronRight, Calendar, AlertTriangle } from 'lucide-react';

const EmergencyBloodDonationPortal = () => {
  const [activeTab, setActiveTab] = useState('disasters');
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const [donationCommitment, setDonationCommitment] = useState(null);
  const [notifications, setNotifications] = useState(3);
  const [timelineFilter, setTimelineFilter] = useState('all');

  // Mock disaster data with severity levels
  const disasters = [
    {
      id: 1,
      type: 'Earthquake',
      location: 'Gujarat Region',
      severity: 'critical',
      unitsNeeded: 450,
      unitsCollected: 180,
      distance: '45 km',
      timePosted: '2 hours ago',
      deadline: '24 hours',
      bloodTypes: ['O+', 'O-', 'A+', 'B+'],
      coordinates: { lat: 23.0225, lng: 72.5714 },
      description: 'Major earthquake aftermath requiring immediate blood supply',
      hospitals: ['Civil Hospital', 'Sterling Hospital', 'Shalby Hospital'],
      blockchainId: '0x7a89f...3d2c1',
      verified: true
    },
    {
      id: 2,
      type: 'Flood',
      location: 'Mumbai Suburbs',
      severity: 'high',
      unitsNeeded: 280,
      unitsCollected: 95,
      distance: '12 km',
      timePosted: '5 hours ago',
      deadline: '48 hours',
      bloodTypes: ['O+', 'A+', 'AB+'],
      coordinates: { lat: 19.0760, lng: 72.8777 },
      description: 'Flash floods affecting multiple areas, blood supply critical',
      hospitals: ['Lilavati Hospital', 'Fortis Hospital'],
      blockchainId: '0x9b12c...5e4a3',
      verified: true
    },
    {
      id: 3,
      type: 'Building Collapse',
      location: 'Delhi NCR',
      severity: 'medium',
      unitsNeeded: 120,
      unitsCollected: 75,
      distance: '8 km',
      timePosted: '1 day ago',
      deadline: '72 hours',
      bloodTypes: ['B+', 'O+', 'A-'],
      coordinates: { lat: 28.7041, lng: 77.1025 },
      description: 'Building collapse rescue operation ongoing',
      hospitals: ['AIIMS', 'Max Hospital'],
      blockchainId: '0x4c56b...7f9d2',
      verified: true
    }
  ];

  // News timeline events
  const timelineEvents = [
    {
      id: 1,
      type: 'disaster',
      title: 'Gujarat Earthquake Response Initiated',
      description: 'Emergency blood drive activated for earthquake victims',
      time: '2 hours ago',
      category: 'critical',
      location: 'Gujarat',
      unitsCollected: 180
    },
    {
      id: 2,
      type: 'milestone',
      title: '1000+ Units Collected This Month',
      description: 'Community achieved major milestone in disaster response',
      time: '6 hours ago',
      category: 'success',
      icon: TrendingUp
    },
    {
      id: 3,
      type: 'disaster',
      title: 'Mumbai Flood Relief Campaign',
      description: 'Multiple donation camps set up across the city',
      time: '5 hours ago',
      category: 'high',
      location: 'Mumbai',
      unitsCollected: 95
    },
    {
      id: 4,
      type: 'update',
      title: 'Chennai Cyclone - Goal Achieved',
      description: 'Required blood units collected, campaign successful',
      time: '1 day ago',
      category: 'success',
      icon: Heart
    },
    {
      id: 5,
      type: 'system',
      title: 'Blockchain Verification Completed',
      description: 'All transactions verified and recorded on blockchain',
      time: '1 day ago',
      category: 'info',
      icon: Shield
    },
    {
      id: 6,
      type: 'disaster',
      title: 'Delhi Building Collapse Emergency',
      description: 'Blood donation drive ongoing at multiple centers',
      time: '1 day ago',
      category: 'medium',
      location: 'Delhi NCR',
      unitsCollected: 75
    }
  ];

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'critical': return 'from-red-500 to-red-700';
      case 'high': return 'from-orange-500 to-orange-700';
      case 'medium': return 'from-yellow-500 to-yellow-700';
      default: return 'from-blue-500 to-blue-700';
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'success': return 'bg-green-100 text-green-800 border-green-300';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleCommitDonation = (disaster) => {
    setDonationCommitment(disaster);
    setNotifications(notifications + 1);
    setTimeout(() => {
      setDonationCommitment(null);
    }, 3000);
  };

  const filteredTimeline = timelineFilter === 'all' 
    ? timelineEvents 
    : timelineEvents.filter(event => event.category === timelineFilter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-red-500 to-red-700 p-2 rounded-xl shadow-lg">
                <Droplet className="h-6 w-6 text-white" fill="white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                  Emergency Response Portal
                </h1>
                <p className="text-xs text-gray-500">Blockchain-Verified Disaster Relief</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-full transition-all">
                <Bell className="h-5 w-5 text-gray-600" />
                {notifications > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {notifications}
                  </span>
                )}
              </button>
              <div className="h-10 w-10 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                D
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Success Notification */}
      {donationCommitment && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-slide-in flex items-center space-x-3">
          <Heart className="h-5 w-5" fill="white" />
          <span className="font-medium">Commitment registered! Nearest center will contact you.</span>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Active Disasters', value: '3', icon: AlertCircle, color: 'red' },
            { label: 'Units Needed', value: '850', icon: Droplet, color: 'blue' },
            { label: 'Units Collected', value: '350', icon: Activity, color: 'green' },
            { label: 'Active Donors', value: '1.2K', icon: Users, color: 'purple' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`bg-${stat.color}-100 p-3 rounded-lg`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 bg-white p-2 rounded-xl shadow-md">
          {['disasters', 'timeline'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-red-500 to-red-700 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab === 'disasters' ? 'Active Disasters' : 'News Timeline'}
            </button>
          ))}
        </div>

        {/* Content Area */}
        {activeTab === 'disasters' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Disaster List */}
            <div className="lg:col-span-2 space-y-6">
              {disasters.map(disaster => (
                <div
                  key={disaster.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer"
                  onClick={() => setSelectedDisaster(disaster)}
                >
                  {/* Severity Banner */}
                  <div className={`bg-gradient-to-r ${getSeverityColor(disaster.severity)} p-4 text-white`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-6 w-6" />
                        <div>
                          <h3 className="text-xl font-bold">{disaster.type}</h3>
                          <p className="text-sm opacity-90">{disaster.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm opacity-90">Distance</p>
                        <p className="text-lg font-bold">{disaster.distance}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Description */}
                    <p className="text-gray-700 mb-4">{disaster.description}</p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-semibold text-gray-700">Collection Progress</span>
                        <span className="text-gray-600">
                          {disaster.unitsCollected} / {disaster.unitsNeeded} units
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`bg-gradient-to-r ${getSeverityColor(disaster.severity)} h-3 rounded-full transition-all duration-500`}
                          style={{ width: `${(disaster.unitsCollected / disaster.unitsNeeded) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>Posted: {disaster.timePosted}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <AlertCircle className="h-4 w-4" />
                        <span>Deadline: {disaster.deadline}</span>
                      </div>
                    </div>

                    {/* Blood Types */}
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Required Blood Types:</p>
                      <div className="flex flex-wrap gap-2">
                        {disaster.bloodTypes.map(type => (
                          <span key={type} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Blockchain Verification */}
                    <div className="flex items-center space-x-2 mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span className="text-xs text-green-700 font-medium">
                        Blockchain Verified: {disaster.blockchainId}
                      </span>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCommitDonation(disaster);
                      }}
                      className="w-full bg-gradient-to-r from-red-500 to-red-700 text-white py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                    >
                      <Heart className="h-5 w-5" />
                      <span>Commit to Donate</span>
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Map & Quick Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-red-600" />
                  Disaster Locations
                </h3>
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg h-64 flex items-center justify-center mb-6">
                  <div className="text-center">
                    <Navigation className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-blue-800 font-medium">Interactive Map View</p>
                    <p className="text-xs text-blue-600">3 Active Locations</p>
                  </div>
                </div>

                {selectedDisaster && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-bold text-gray-900 mb-3">Selected: {selectedDisaster.type}</h4>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Location</p>
                          <p className="text-sm text-gray-600">{selectedDisaster.location}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Activity className="h-4 w-4 text-gray-500 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Nearby Hospitals</p>
                          {selectedDisaster.hospitals.map((hospital, idx) => (
                            <p key={idx} className="text-sm text-gray-600">{hospital}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Timeline View
          <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Timeline Filters */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Calendar className="h-6 w-6 mr-2 text-red-600" />
                Emergency Response Timeline
              </h2>
              <div className="flex space-x-2">
                {['all', 'critical', 'high', 'success'].map(filter => (
                  <button
                    key={filter}
                    onClick={() => setTimelineFilter(filter)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      timelineFilter === filter
                        ? 'bg-red-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-500 via-orange-500 to-green-500"></div>

              {/* Timeline Events */}
              <div className="space-y-8">
                {filteredTimeline.map((event, idx) => {
                  const IconComponent = event.icon || AlertCircle;
                  return (
                    <div key={event.id} className="relative pl-20 animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                      {/* Timeline Dot */}
                      <div className={`absolute left-4 w-8 h-8 rounded-full border-4 border-white shadow-lg flex items-center justify-center ${
                        event.category === 'critical' ? 'bg-red-500' :
                        event.category === 'high' ? 'bg-orange-500' :
                        event.category === 'success' ? 'bg-green-500' :
                        'bg-blue-500'
                      }`}>
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>

                      {/* Event Card */}
                      <div className={`border-2 rounded-lg p-4 hover:shadow-lg transition-all ${getCategoryColor(event.category)}`}>
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-lg">{event.title}</h3>
                          <span className="text-xs opacity-75">{event.time}</span>
                        </div>
                        <p className="text-sm mb-3 opacity-90">{event.description}</p>
                        {event.location && (
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {event.location}
                            </span>
                            {event.unitsCollected && (
                              <span className="flex items-center">
                                <Droplet className="h-4 w-4 mr-1" />
                                {event.unitsCollected} units collected
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default EmergencyBloodDonationPortal;