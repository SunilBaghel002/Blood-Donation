import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  Droplet,
  MapPin,
  Clock,
  Users,
  Activity,
  TrendingUp,
  Bell,
  Plus,
  Heart,
  Shield,
  CheckCircle,
  XCircle,
  Calendar,
  AlertTriangle,
  Zap,
  Target,
  Award,
  Phone,
  Send,
  Edit,
  Trash2,
  Eye,
  Database,
  BarChart3,
  FileText,
  Filter,
  Search,
  Download,
  Radio,
  ChevronDown,
} from "lucide-react";

const HospitalEmergencyDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [isLoading, setIsLoading] = useState(false);

  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      title: "Earthquake Relief - Gujarat",
      status: "active",
      severity: "critical",
      unitsNeeded: 450,
      unitsReceived: 180,
      unitsCommitted: 95,
      location: "Civil Hospital, Gujarat",
      createdAt: "2 hours ago",
      deadline: "24 hours",
      bloodTypes: ["O+", "O-", "A+", "B+"],
      description:
        "Major earthquake aftermath requiring immediate blood supply for trauma care",
      donors: 45,
      blockchainId: "0x7a89f...3d2c1",
      verified: true,
    },
    {
      id: 2,
      title: "Flood Emergency - Mumbai",
      status: "active",
      severity: "high",
      unitsNeeded: 280,
      unitsReceived: 95,
      unitsCommitted: 60,
      location: "Lilavati Hospital, Mumbai",
      createdAt: "5 hours ago",
      deadline: "48 hours",
      bloodTypes: ["O+", "A+", "AB+"],
      description: "Flash floods affecting multiple areas",
      donors: 32,
      blockchainId: "0x9b12c...5e4a3",
      verified: true,
    },
    {
      id: 3,
      title: "Building Collapse - Delhi",
      status: "completed",
      severity: "medium",
      unitsNeeded: 120,
      unitsReceived: 125,
      unitsCommitted: 0,
      location: "AIIMS, Delhi",
      createdAt: "1 day ago",
      deadline: "Completed",
      bloodTypes: ["B+", "O+", "A-"],
      description: "Building collapse rescue operation successfully completed",
      donors: 28,
      blockchainId: "0x4c56b...7f9d2",
      verified: true,
    },
  ]);

  const [newCampaign, setNewCampaign] = useState({
    title: "",
    severity: "high",
    unitsNeeded: "",
    location: "",
    deadline: "",
    bloodTypes: [],
    description: "",
  });

  const [errors, setErrors] = useState({});

  const bloodTypes = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

  const timelineEvents = [
    {
      id: 1,
      type: "campaign",
      title: "New Emergency Campaign",
      desc: "Gujarat Earthquake Relief activated",
      time: "2h ago",
      status: "critical",
      icon: AlertTriangle,
    },
    {
      id: 2,
      type: "donation",
      title: "50 Units Received",
      desc: "Blood Bank donated O+ units",
      time: "3h ago",
      status: "success",
      icon: Droplet,
    },
    {
      id: 3,
      type: "milestone",
      title: "Campaign 50% Complete",
      desc: "Mumbai Relief reached halfway",
      time: "4h ago",
      status: "info",
      icon: Target,
    },
    {
      id: 4,
      type: "complete",
      title: "Campaign Completed",
      desc: "Delhi operation successful",
      time: "1d ago",
      status: "success",
      icon: Award,
    },
    {
      id: 5,
      type: "verify",
      title: "Blockchain Verified",
      desc: "All transactions recorded",
      time: "1d ago",
      status: "info",
      icon: Shield,
    },
  ];

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setCampaigns((prev) =>
        prev.map((campaign) => {
          if (campaign.status === "active" && Math.random() > 0.8) {
            return {
              ...campaign,
              unitsReceived: Math.min(
                campaign.unitsNeeded,
                campaign.unitsReceived + Math.floor(Math.random() * 10)
              ),
              donors: campaign.donors + Math.floor(Math.random() * 2),
            };
          }
          return campaign;
        })
      );
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!newCampaign.title.trim()) newErrors.title = "Title is required";
    if (
      !newCampaign.unitsNeeded ||
      isNaN(newCampaign.unitsNeeded) ||
      newCampaign.unitsNeeded <= 0
    )
      newErrors.unitsNeeded = "Valid units needed is required";
    if (!newCampaign.location.trim())
      newErrors.location = "Location is required";
    if (!newCampaign.deadline.trim())
      newErrors.deadline = "Deadline is required";
    if (newCampaign.bloodTypes.length === 0)
      newErrors.bloodTypes = "At least one blood type is required";
    if (!newCampaign.description.trim())
      newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateCampaign = () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setTimeout(() => {
      const newId = campaigns.length + 1;
      const createdCampaign = {
        id: newId,
        ...newCampaign,
        status: "active",
        unitsReceived: 0,
        unitsCommitted: 0,
        createdAt: "Just now",
        donors: 0,
        blockchainId: `0x${Math.random()
          .toString(16)
          .substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`,
        verified: false,
        unitsNeeded: parseInt(newCampaign.unitsNeeded),
      };
      setCampaigns([createdCampaign, ...campaigns]);
      setShowCreateModal(false);
      setNewCampaign({
        title: "",
        severity: "high",
        unitsNeeded: "",
        location: "",
        deadline: "",
        bloodTypes: [],
        description: "",
      });
      setErrors({});
      setIsLoading(false);
    }, 1000);
  };

  const toggleBloodType = (type) => {
    setNewCampaign({
      ...newCampaign,
      bloodTypes: newCampaign.bloodTypes.includes(type)
        ? newCampaign.bloodTypes.filter((t) => t !== type)
        : [...newCampaign.bloodTypes, type],
    });
  };

  const filteredCampaigns = campaigns
    .filter(
      (campaign) =>
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      (campaign) =>
        filterSeverity === "all" || campaign.severity === filterSeverity
    )
    .sort((a, b) => {
      if (sortBy === "createdAt")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "severity") {
        const severityOrder = { critical: 3, high: 2, medium: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      }
      if (sortBy === "progress")
        return (
          b.unitsReceived / b.unitsNeeded - a.unitsReceived / a.unitsNeeded
        );
      return 0;
    });

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical":
        return "from-red-500 to-pink-600";
      case "high":
        return "from-orange-500 to-yellow-600";
      case "medium":
        return "from-yellow-500 to-green-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
        .animate-fadeInLeft { animation: fadeInLeft 0.6s ease-out forwards; }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Floating Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div
            className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>

        {/* Navbar */}
        <nav className="relative z-10 px-8 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-red-500 to-pink-600 p-4 rounded-3xl shadow-2xl">
                <Activity className="h-8 w-8 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Hospital Dashboard
                </h1>
                <p className="text-blue-200 text-sm">
                  Emergency Response Center
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <button className="text-white/80 hover:text-white transition-all px-6 py-3 rounded-2xl hover:bg-white/10 font-medium">
                Reports
              </button>
              <button className="relative">
                <Bell className="h-6 w-6 text-white" />
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center animate-bounce">
                  5
                </span>
              </button>
              <div className="h-12 w-12 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-xl">
                H
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-8 py-8">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-10">
            {[
              {
                label: "Active",
                value: "2",
                icon: Radio,
                gradient: "from-red-500 to-orange-500",
              },
              {
                label: "Required",
                value: "730",
                icon: Target,
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                label: "Received",
                value: "275",
                icon: Droplet,
                gradient: "from-green-500 to-emerald-500",
              },
              {
                label: "Donors",
                value: "77",
                icon: Users,
                gradient: "from-purple-500 to-pink-500",
              },
              {
                label: "Completed",
                value: "1",
                icon: CheckCircle,
                gradient: "from-teal-500 to-cyan-500",
              },
              {
                label: "Verified",
                value: "3",
                icon: Shield,
                gradient: "from-yellow-500 to-orange-500",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="group hover:scale-105 transition-transform duration-300"
              >
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
                  <div
                    className={`bg-gradient-to-br ${stat.gradient} w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-lg`}
                  >
                    <stat.icon
                      className="h-6 w-6 text-white"
                      strokeWidth={2.5}
                    />
                  </div>
                  <div className="text-4xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-blue-200 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex space-x-3">
              {[
                { id: "overview", label: "Campaigns", icon: BarChart3 },
                { id: "timeline", label: "Timeline", icon: Calendar },
                { id: "analytics", label: "Analytics", icon: TrendingUp },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center space-x-3 ${
                    activeTab === tab.id
                      ? "bg-white text-purple-900 shadow-2xl scale-105"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                  aria-label={`Switch to ${tab.label} tab`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center space-x-3 shadow-2xl hover:scale-105"
              aria-label="Create new campaign"
            >
              <Plus className="h-6 w-6" />
              <span>New Campaign</span>
            </button>
          </div>

          {/* Content Areas */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Search and Filters */}
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-300" />
                  <input
                    type="text"
                    placeholder="Search campaigns by title or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-blue-300 focus:outline-none focus:border-white/40 transition-all text-lg"
                  />
                </div>
                <div className="flex space-x-4">
                  <select
                    value={filterSeverity}
                    onChange={(e) => setFilterSeverity(e.target.value)}
                    className="px-4 py-3 bg-white/5 border border-white/20 rounded-2xl text-white focus:outline-none focus:border-white/40"
                  >
                    <option value="all">All Severities</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 bg-white/5 border border-white/20 rounded-2xl text-white focus:outline-none focus:border-white/40"
                  >
                    <option value="createdAt">Newest First</option>
                    <option value="severity">By Severity</option>
                    <option value="progress">By Progress</option>
                  </select>
                </div>
              </div>

              {filteredCampaigns.map((campaign, idx) => (
                <div
                  key={campaign.id}
                  className="group relative animate-fadeInUp"
                  style={{ animationDelay: `${idx * 0.15}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all"></div>

                  <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-4">
                          {campaign.status === "active" && (
                            <span
                              className="flex items-center px-4 py-2 bg-green-500/20 backdrop-blur-sm rounded-full border border-green-400/50"
                              role="status"
                            >
                              <div className="h-2 w-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                              <span className="text-green-200 text-sm font-semibold">
                                ACTIVE
                              </span>
                            </span>
                          )}
                          {campaign.status === "completed" && (
                            <span
                              className="flex items-center px-4 py-2 bg-blue-500/20 backdrop-blur-sm rounded-full border border-blue-400/50"
                              role="status"
                            >
                              <CheckCircle className="h-4 w-4 text-blue-300 mr-2" />
                              <span className="text-blue-200 text-sm font-semibold">
                                COMPLETED
                              </span>
                            </span>
                          )}
                          <span
                            className={`px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm border ${
                              campaign.severity === "critical"
                                ? "bg-red-500/20 text-red-200 border-red-400/50"
                                : campaign.severity === "high"
                                ? "bg-orange-500/20 text-orange-200 border-orange-400/50"
                                : "bg-yellow-500/20 text-yellow-200 border-yellow-400/50"
                            }`}
                          >
                            {campaign.severity.toUpperCase()}
                          </span>
                        </div>

                        <h2
                          className="text-4xl font-bold text-white mb-3"
                          id={`campaign-title-${campaign.id}`}
                        >
                          {campaign.title}
                        </h2>

                        <div className="flex flex-wrap items-center gap-6 text-blue-200">
                          <span className="flex items-center text-base">
                            <MapPin className="h-5 w-5 mr-2" />
                            {campaign.location}
                          </span>
                          <span className="flex items-center text-base">
                            <Clock className="h-5 w-5 mr-2" />
                            {campaign.createdAt}
                          </span>
                          <span className="flex items-center text-base">
                            <Users className="h-5 w-5 mr-2" />
                            {campaign.donors} donors
                          </span>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <button
                          className="p-3 hover:bg-white/10 rounded-xl transition-all"
                          onClick={() => setSelectedCampaign(campaign)}
                          aria-label="View campaign details"
                        >
                          <Eye className="h-6 w-6 text-white" />
                        </button>
                        <button
                          className="p-3 hover:bg-white/10 rounded-xl transition-all"
                          aria-label="Edit campaign"
                        >
                          <Edit className="h-6 w-6 text-white" />
                        </button>
                        <button
                          className="p-3 hover:bg-red-500/20 rounded-xl transition-all"
                          aria-label="Delete campaign"
                        >
                          <Trash2 className="h-6 w-6 text-red-300" />
                        </button>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                      {campaign.description}
                    </p>

                    {/* Progress Section */}
                    <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 mb-8">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
                        <div>
                          <div className="text-blue-300 text-sm mb-2 font-medium">
                            Received
                          </div>
                          <div className="text-5xl font-bold text-white">
                            {campaign.unitsReceived}
                          </div>
                        </div>
                        <div>
                          <div className="text-blue-300 text-sm mb-2 font-medium">
                            Committed
                          </div>
                          <div className="text-5xl font-bold text-white">
                            {campaign.unitsCommitted}
                          </div>
                        </div>
                        <div>
                          <div className="text-blue-300 text-sm mb-2 font-medium">
                            Target
                          </div>
                          <div className="text-5xl font-bold text-white">
                            {campaign.unitsNeeded}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-white">
                          <span className="font-semibold text-lg">
                            Progress
                          </span>
                          <span className="text-2xl font-bold">
                            {Math.round(
                              (campaign.unitsReceived / campaign.unitsNeeded) *
                                100
                            )}
                            %
                          </span>
                        </div>
                        <div className="h-4 bg-white/20 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${getSeverityColor(
                              campaign.severity
                            )} transition-all duration-1000`}
                            style={{
                              width: `${Math.min(
                                (campaign.unitsReceived /
                                  campaign.unitsNeeded) *
                                  100,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                      <div>
                        <div className="text-blue-300 text-sm font-semibold mb-3">
                          Blood Types
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {campaign.bloodTypes.map((type) => (
                            <span
                              key={type}
                              className="px-4 py-2 bg-red-500/20 border border-red-400/50 text-red-200 rounded-xl font-bold text-sm"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-blue-300 text-sm font-semibold mb-3">
                          Deadline
                        </div>
                        <div className="text-white text-2xl font-bold">
                          {campaign.deadline}
                        </div>
                      </div>
                      <div>
                        <div className="text-blue-300 text-sm font-semibold mb-3">
                          Blockchain Status
                        </div>
                        <div className="flex items-center space-x-2">
                          {campaign.verified ? (
                            <>
                              <Shield className="h-5 w-5 text-green-400" />
                              <span className="text-green-300 font-semibold">
                                Verified
                              </span>
                            </>
                          ) : (
                            <>
                              <Clock className="h-5 w-5 text-yellow-400" />
                              <span className="text-yellow-300 font-semibold">
                                Pending
                              </span>
                            </>
                          )}
                        </div>
                        <div className="text-blue-300 text-xs font-mono mt-1">
                          {campaign.blockchainId}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                      <button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-4 rounded-2xl font-semibold text-lg transition-all flex items-center justify-center space-x-2 border border-white/20">
                        <Send className="h-5 w-5" />
                        <span>Send Alert</span>
                      </button>
                      <button className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white py-4 rounded-2xl font-semibold text-lg transition-all flex items-center justify-center space-x-2 shadow-xl">
                        <FileText className="h-5 w-5" />
                        <span>View Report</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredCampaigns.length === 0 && (
                <div className="text-center py-12">
                  <Search className="h-16 w-16 text-blue-300 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">
                    No campaigns found
                  </h3>
                  <p className="text-blue-200">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 border border-white/20">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-4xl font-bold text-white flex items-center">
                  <Calendar className="h-10 w-10 mr-4" />
                  Activity Timeline
                </h2>
                <div className="flex space-x-3">
                  <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-medium transition-all flex items-center space-x-2">
                    <Filter className="h-5 w-5" />
                    <span>Filter</span>
                  </button>
                </div>
              </div>
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400 rounded-full"></div>
                <div className="space-y-8">
                  {timelineEvents.map((event, idx) => (
                    <div
                      key={event.id}
                      className="relative pl-20 animate-fadeInLeft"
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      <div
                        className={`absolute left-2 w-10 h-10 rounded-2xl flex items-center justify-center shadow-2xl ${
                          event.status === "critical"
                            ? "bg-gradient-to-br from-red-500 to-pink-600"
                            : event.status === "success"
                            ? "bg-gradient-to-br from-green-500 to-emerald-600"
                            : "bg-gradient-to-br from-blue-500 to-cyan-600"
                        }`}
                      >
                        <event.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="bg-white/10 hover:bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20 transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-2xl font-bold text-white">
                            {event.title}
                          </h3>
                          <span className="text-blue-300 text-sm">
                            {event.time}
                          </span>
                        </div>
                        <p className="text-blue-200 text-lg">{event.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                  <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
                    <BarChart3 className="h-8 w-8 mr-3" />
                    Campaign Progress
                  </h3>
                  <div className="space-y-6">
                    {campaigns.map((c) => (
                      <div key={c.id}>
                        <div className="flex justify-between mb-2">
                          <span className="text-white font-semibold text-lg">
                            {c.title}
                          </span>
                          <span className="text-blue-200 text-lg">
                            {Math.round(
                              (c.unitsReceived / c.unitsNeeded) * 100
                            )}
                            %
                          </span>
                        </div>
                        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${getSeverityColor(
                              c.severity
                            )} rounded-full`}
                            style={{
                              width: `${
                                (c.unitsReceived / c.unitsNeeded) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                  <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
                    <Users className="h-8 w-8 mr-3" />
                    Key Metrics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        label: "Total Donors",
                        value: "77",
                        trend: "+15%",
                        color: "from-blue-500 to-cyan-600",
                      },
                      {
                        label: "Avg Response",
                        value: "2.3h",
                        trend: "Fast",
                        color: "from-purple-500 to-pink-600",
                      },
                      {
                        label: "Success Rate",
                        value: "94%",
                        trend: "High",
                        color: "from-green-500 to-emerald-600",
                      },
                      {
                        label: "Active Now",
                        value: "2",
                        trend: "Live",
                        color: "from-orange-500 to-red-600",
                      },
                    ].map((metric, i) => (
                      <div
                        key={i}
                        className={`bg-gradient-to-br ${metric.color} bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 border border-white/20`}
                      >
                        <div className="text-blue-200 text-sm mb-2">
                          {metric.label}
                        </div>
                        <div className="text-4xl font-bold text-white mb-1">
                          {metric.value}
                        </div>
                        <div className="text-green-300 text-sm font-semibold">
                          {metric.trend}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
                  <Droplet className="h-8 w-8 mr-3" />
                  Blood Type Distribution
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { type: "O+", units: 96, percent: 35 },
                    { type: "A+", units: 77, percent: 28 },
                    { type: "B+", units: 55, percent: 20 },
                    { type: "AB+", units: 47, percent: 17 },
                  ].map((blood, i) => (
                    <div
                      key={i}
                      className="text-center hover:scale-105 transition-transform"
                    >
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                        <div className="text-5xl font-bold text-white mb-3">
                          {blood.type}
                        </div>
                        <div className="h-3 bg-white/20 rounded-full mb-3 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-red-500 to-pink-600 rounded-full"
                            style={{ width: `${blood.percent}%` }}
                          ></div>
                        </div>
                        <div className="text-2xl font-bold text-white">
                          {blood.units}
                        </div>
                        <div className="text-blue-300 text-sm">units</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="bg-gradient-to-br from-purple-900/95 to-blue-900/95 backdrop-blur-xl rounded-3xl max-w-4xl w-full p-10 border border-white/20 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 id="modal-title" className="text-4xl font-bold text-white">
                  Create Emergency Campaign
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-all"
                  aria-label="Close modal"
                >
                  <XCircle className="h-8 w-8 text-white" />
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-blue-200 font-semibold mb-3 text-lg">
                    Campaign Title *
                  </label>
                  <input
                    type="text"
                    value={newCampaign.title}
                    onChange={(e) =>
                      setNewCampaign({ ...newCampaign, title: e.target.value })
                    }
                    placeholder="e.g., Earthquake Relief - Gujarat"
                    className={`w-full px-6 py-4 rounded-2xl bg-white/10 border-2 ${
                      errors.title
                        ? "border-red-400 focus:border-red-400"
                        : "border-white/20 focus:border-white/40"
                    } focus:outline-none text-white placeholder-blue-300 text-lg backdrop-blur-sm transition-all`}
                    aria-invalid={!!errors.title}
                    aria-describedby={errors.title ? "title-error" : undefined}
                  />
                  {errors.title && (
                    <p
                      id="title-error"
                      className="text-red-300 text-sm mt-1 flex items-center"
                    >
                      <AlertCircle className="h-4 w-4 mr-1" /> {errors.title}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-blue-200 font-semibold mb-3 text-lg">
                      Severity *
                    </label>
                    <select
                      value={newCampaign.severity}
                      onChange={(e) =>
                        setNewCampaign({
                          ...newCampaign,
                          severity: e.target.value,
                        })
                      }
                      className="w-full px-6 py-4 rounded-2xl bg-white/10 border-2 border-white/20 focus:border-white/40 focus:outline-none text-white text-lg backdrop-blur-sm transition-all"
                      aria-label="Select severity level"
                    >
                      <option value="critical">Critical</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-blue-200 font-semibold mb-3 text-lg">
                      Units Needed *
                    </label>
                    <input
                      type="number"
                      value={newCampaign.unitsNeeded}
                      onChange={(e) =>
                        setNewCampaign({
                          ...newCampaign,
                          unitsNeeded: e.target.value,
                        })
                      }
                      placeholder="e.g., 450"
                      min="1"
                      className={`w-full px-6 py-4 rounded-2xl bg-white/10 border-2 ${
                        errors.unitsNeeded
                          ? "border-red-400 focus:border-red-400"
                          : "border-white/20 focus:border-white/40"
                      } focus:outline-none text-white placeholder-blue-300 text-lg backdrop-blur-sm transition-all`}
                      aria-invalid={!!errors.unitsNeeded}
                      aria-describedby={
                        errors.unitsNeeded ? "units-error" : undefined
                      }
                    />
                    {errors.unitsNeeded && (
                      <p
                        id="units-error"
                        className="text-red-300 text-sm mt-1 flex items-center"
                      >
                        <AlertCircle className="h-4 w-4 mr-1" />{" "}
                        {errors.unitsNeeded}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-blue-200 font-semibold mb-3 text-lg">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={newCampaign.location}
                    onChange={(e) =>
                      setNewCampaign({
                        ...newCampaign,
                        location: e.target.value,
                      })
                    }
                    placeholder="e.g., Civil Hospital, Gujarat"
                    className={`w-full px-6 py-4 rounded-2xl bg-white/10 border-2 ${
                      errors.location
                        ? "border-red-400 focus:border-red-400"
                        : "border-white/20 focus:border-white/40"
                    } focus:outline-none text-white placeholder-blue-300 text-lg backdrop-blur-sm transition-all`}
                    aria-invalid={!!errors.location}
                    aria-describedby={
                      errors.location ? "location-error" : undefined
                    }
                  />
                  {errors.location && (
                    <p
                      id="location-error"
                      className="text-red-300 text-sm mt-1 flex items-center"
                    >
                      <AlertCircle className="h-4 w-4 mr-1" /> {errors.location}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-blue-200 font-semibold mb-3 text-lg">
                    Deadline *
                  </label>
                  <input
                    type="text"
                    value={newCampaign.deadline}
                    onChange={(e) =>
                      setNewCampaign({
                        ...newCampaign,
                        deadline: e.target.value,
                      })
                    }
                    placeholder="e.g., 24 hours"
                    className={`w-full px-6 py-4 rounded-2xl bg-white/10 border-2 ${
                      errors.deadline
                        ? "border-red-400 focus:border-red-400"
                        : "border-white/20 focus:border-white/40"
                    } focus:outline-none text-white placeholder-blue-300 text-lg backdrop-blur-sm transition-all`}
                    aria-invalid={!!errors.deadline}
                    aria-describedby={
                      errors.deadline ? "deadline-error" : undefined
                    }
                  />
                  {errors.deadline && (
                    <p
                      id="deadline-error"
                      className="text-red-300 text-sm mt-1 flex items-center"
                    >
                      <AlertCircle className="h-4 w-4 mr-1" /> {errors.deadline}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-blue-200 font-semibold mb-3 text-lg">
                    Blood Types * (Select at least one)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {bloodTypes.map((type) => (
                      <label
                        key={type}
                        className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl border border-white/20 cursor-pointer hover:border-white/40 transition-all"
                      >
                        <input
                          type="checkbox"
                          checked={newCampaign.bloodTypes.includes(type)}
                          onChange={() => toggleBloodType(type)}
                          className="rounded text-red-500 focus:ring-red-500"
                        />
                        <span className="text-white font-semibold">{type}</span>
                      </label>
                    ))}
                  </div>
                  {errors.bloodTypes && (
                    <p className="text-red-300 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />{" "}
                      {errors.bloodTypes}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-blue-200 font-semibold mb-3 text-lg">
                    Description *
                  </label>
                  <textarea
                    value={newCampaign.description}
                    onChange={(e) =>
                      setNewCampaign({
                        ...newCampaign,
                        description: e.target.value,
                      })
                    }
                    placeholder="Brief description of the emergency..."
                    rows={4}
                    className={`w-full px-6 py-4 rounded-2xl bg-white/10 border-2 ${
                      errors.description
                        ? "border-red-400 focus:border-red-400"
                        : "border-white/20 focus:border-white/40"
                    } focus:outline-none text-white placeholder-blue-300 text-lg backdrop-blur-sm transition-all resize-none`}
                    aria-invalid={!!errors.description}
                    aria-describedby={
                      errors.description ? "description-error" : undefined
                    }
                  />
                  {errors.description && (
                    <p
                      id="description-error"
                      className="text-red-300 text-sm mt-1 flex items-center"
                    >
                      <AlertCircle className="h-4 w-4 mr-1" />{" "}
                      {errors.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-end space-x-4 pt-6">
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setErrors({});
                      setNewCampaign({
                        title: "",
                        severity: "high",
                        unitsNeeded: "",
                        location: "",
                        deadline: "",
                        bloodTypes: [],
                        description: "",
                      });
                    }}
                    className="px-8 py-3 text-white/80 hover:text-white bg-white/10 rounded-2xl font-semibold transition-all"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateCampaign}
                    disabled={isLoading}
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl font-bold transition-all flex items-center space-x-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-5 w-5" />
                        <span>Create Campaign</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Campaign Details Modal (Optional enhancement) */}
        {selectedCampaign && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            role="dialog"
            aria-modal="true"
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl max-w-2xl w-full p-8 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-bold text-white">
                  Campaign Details
                </h3>
                <button
                  onClick={() => setSelectedCampaign(null)}
                  className="p-2 hover:bg-white/10 rounded-xl"
                >
                  <XCircle className="h-6 w-6 text-white" />
                </button>
              </div>
              <div className="space-y-4 text-blue-200">
                <p>
                  <strong>Title:</strong> {selectedCampaign.title}
                </p>
                <p>
                  <strong>Location:</strong> {selectedCampaign.location}
                </p>
                <p>
                  <strong>Description:</strong> {selectedCampaign.description}
                </p>
                <p>
                  <strong>Progress:</strong>{" "}
                  {Math.round(
                    (selectedCampaign.unitsReceived /
                      selectedCampaign.unitsNeeded) *
                      100
                  )}
                  %
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HospitalEmergencyDashboard;
