"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Search,
  User,
  Send,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Gift,
  ChevronRight,
  Menu,
  X,
  Wallet,
  Users,
  Plus,
} from "lucide-react"
import { TransferController } from "../../controllers/TransferController.js"
import FriendController from "../../controllers/FriendController.js"

export const TransferPage = () => {
  const [formData, setFormData] = useState({
    step: 1,
    searchQuery: "",
    searchResults: [],
    selectedUser: null,
    amount: "",
    message: "",
    loading: false,
    error: "",
    success: false,
    userData: null,
    transferType: "normal",
  })
  const [controller] = useState(() => new TransferController())
  const [transferMode, setTransferMode] = useState("search")
  const [friends, setFriends] = useState([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Fetch user profile only
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await controller.fetchUserData()
        setFormData((prev) => ({ ...prev, userData: data.userData }))
      } catch (error) {
        setFormData((prev) => ({
          ...prev,
          error: error.message || "Failed to fetch user data",
          userData: null,
        }))
        console.error("Error fetching user data:", error)
      }
    }
    fetchUserData()
  }, [])

  // Fetch friends when mode is 'friend'
  useEffect(() => {
    if (transferMode === "friend") {
      const fetchFriends = async () => {
        const response = await FriendController.getFriends()
        if (response.success) setFriends(response.friends)
      }
      fetchFriends()
    }
  }, [transferMode])

  const handleChange = (name, value) => {
    const updatedData = controller.updateField(name, value)
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSearch = async () => {
    if (!formData.searchQuery.trim()) return
    setFormData((prev) => ({ ...prev, loading: true, error: "" }))
    const result = await controller.searchUser(formData.searchQuery)
    setFormData((prev) => ({
      ...prev,
      searchResults: result.results || [],
      error: result.error || "",
      loading: false,
    }))
  }

  const selectUser = (user) => {
    setFormData((prev) => ({
      ...prev,
      selectedUser: user,
      step: 2,
      error: "",
    }))
  }

  const handleAmountChange = (e) => {
    const value = e.target.value
    if (/^\d*$/.test(value)) {
      handleChange("amount", value)
    }
  }

  const goToConfirmation = () => {
    const validation = controller.validateAmount(formData.amount)
    if (!validation.valid) {
      setFormData((prev) => ({ ...prev, error: validation.message }))
      return
    }
    setFormData((prev) => ({ ...prev, error: "", step: 3 }))
  }

  const handleTransfer = async () => {
    setFormData((prev) => ({ ...prev, loading: true, error: "" }))
    const response = await controller.transferMoney(
      formData.selectedUser,
      formData.amount,
      formData.transferType,
      formData.message,
    )
    if (response.success) {
      setFormData((prev) => ({ ...prev, success: true, step: 4, loading: false }))
    } else {
      setFormData((prev) => ({
        ...prev,
        error: response.message || "Transfer failed",
        loading: false,
      }))
    }
  }

  const resetForm = () => {
    setFormData({
      step: 1,
      searchQuery: "",
      searchResults: [],
      selectedUser: null,
      amount: "",
      message: "",
      loading: false,
      error: "",
      success: false,
      userData: formData.userData,
      transferType: "normal",
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "decimal",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date)
  }

  const {
    step,
    searchQuery,
    searchResults,
    selectedUser,
    amount,
    message,
    loading,
    error,
    success,
    userData,
    transferType,
  } = formData

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link to="/dashboard">
                <img src="https://github.com/ThePayPlus/PayPlus_FE/blob/main/public/Logo.png?raw=true" alt="PayPlus Logo" className="h-10" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden sm:flex space-x-4">
              <Link 
                to="/topUp" 
                className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Top-Up
              </Link>
              <Link 
                to="/transfer" 
                className="text-indigo-600 font-medium border-b-2 border-indigo-600 hover:text-indigo-800 transition-colors duration-200"
              >
                Transfer
              </Link>
              <Link 
                to="/bills" 
                className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Bills
              </Link>
              <Link 
                to="/expense" 
                className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Expenses
              </Link>
              <Link 
                to="/income" 
                className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Income
              </Link>
              <Link 
                to="/savings" 
                className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Savings
              </Link>
              <Link 
                to="/friends" 
                className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Friends
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-gray-600" /> : <Menu className="w-6 h-6 text-gray-600" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="sm:hidden py-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-4">
                <Link
                  to="/TopUp"
                  className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Top-Up
                </Link>
                <Link
                  to="/Transfer"
                  className="text-indigo-600 font-medium border-b-2 border-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Transfer
                </Link>
                <Link
                  to="/bills"
                  className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Bills
                </Link>
                <Link
                  to="/Expense"
                  className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Expenses
                </Link>
                <Link
                  to="/Income"
                  className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Income
                </Link>
                <Link
                  to="/Savings"
                  className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Savings
                </Link>
                <Link
                  to="/Friends"
                  className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Friends
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {step === 1 && (
          <div className="max-w-2xl mx-auto">
            {/* Page Title */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Send Money</h1>
              <p className="text-slate-600">Transfer money to friends and family instantly</p>
            </div>

            {/* Balance Card */}
            {userData && (
              <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 mb-8 shadow-xl">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-blue-100 text-sm font-medium mb-1">Available Balance</p>
                      <p className="text-4xl font-bold text-white">Rp {formatCurrency(userData.balance || 0)}</p>
                    </div>
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <Wallet className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center text-blue-100 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    Ready for transfers
                  </div>
                </div>
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full"></div>
                <div className="absolute -left-4 -top-4 w-24 h-24 bg-white/5 rounded-full"></div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                onClick={() => setTransferMode("search")}
                className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                  transferMode === "search"
                    ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
                    : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-md"
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                      transferMode === "search" ? "bg-blue-500" : "bg-slate-100"
                    }`}
                  >
                    <Search className={`w-6 h-6 ${transferMode === "search" ? "text-white" : "text-slate-600"}`} />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">Search Number</h3>
                  <p className="text-sm text-slate-600">Find by phone number</p>
                </div>
              </button>

              <button
                onClick={() => setTransferMode("friend")}
                className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                  transferMode === "friend"
                    ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
                    : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-md"
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                      transferMode === "friend" ? "bg-blue-500" : "bg-slate-100"
                    }`}
                  >
                    <Users className={`w-6 h-6 ${transferMode === "friend" ? "text-white" : "text-slate-600"}`} />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">From Friends</h3>
                  <p className="text-sm text-slate-600">Select from contacts</p>
                </div>
              </button>
            </div>

            {/* Transfer Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              {/* Search by Number */}
              {transferMode === "search" && (
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <Search className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-slate-900">Find Recipient</h2>
                  </div>

                  <div className="relative mb-6">
                    <input
                      type="text"
                      placeholder="Enter phone number"
                      value={searchQuery}
                      onChange={(e) => handleChange("searchQuery", e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-lg"
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <button
                      onClick={handleSearch}
                      disabled={loading || !searchQuery.trim()}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Search className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-start">
                      <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                      <p>{error}</p>
                    </div>
                  )}

                  {/* Search Results */}
                  {searchResults.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">Search Results</h3>
                      {searchResults.map((user) => (
                        <div
                          key={user.phone}
                          onClick={() => selectUser(user)}
                          className="flex items-center p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                        >
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mr-4">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-grow">
                            <p className="font-semibold text-slate-900">{user.name}</p>
                            <p className="text-slate-600">{user.phone}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Select from Friends */}
              {transferMode === "friend" && (
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-slate-900">Select Friend</h2>
                  </div>

                  {friends.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-10 h-10 text-slate-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">No Friends Yet</h3>
                      <p className="text-slate-600 mb-6">Add friends to make transfers easier</p>
                      <Link
                        to="/friends"
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Friends
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {friends.map((friend) => (
                        <div
                          key={friend.phone}
                          onClick={() => selectUser(friend)}
                          className="flex items-center p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                        >
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mr-4">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-grow">
                            <p className="font-semibold text-slate-900">{friend.name}</p>
                            <p className="text-slate-600">{friend.phone}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && selectedUser && (
          <div className="max-w-lg mx-auto">
            <button
              onClick={() => setFormData((prev) => ({ ...prev, step: 1 }))}
              className="flex items-center text-blue-600 mb-6 hover:text-blue-700 transition-colors duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Search
            </button>

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Enter Amount</h1>
              <p className="text-slate-600">How much would you like to send?</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              {/* Recipient Info */}
              <div className="flex items-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mr-4">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-900">{selectedUser.name}</p>
                  <p className="text-slate-600">{selectedUser.phone}</p>
                </div>
              </div>

              {/* Transfer Type Selection */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-slate-900 mb-4">Transfer Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleChange("transferType", "normal")}
                    className={`p-6 border-2 rounded-xl transition-all duration-200 ${
                      transferType === "normal"
                        ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
                        : "border-slate-200 hover:border-blue-300 hover:shadow-md"
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                          transferType === "normal" ? "bg-blue-500" : "bg-slate-100"
                        }`}
                      >
                        <Send className={`w-6 h-6 ${transferType === "normal" ? "text-white" : "text-slate-600"}`} />
                      </div>
                      <span
                        className={`font-semibold ${transferType === "normal" ? "text-blue-600" : "text-slate-700"}`}
                      >
                        Normal
                      </span>
                      <span className="text-sm text-slate-500 mt-1">Regular transfer</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleChange("transferType", "gift")}
                    className={`p-6 border-2 rounded-xl transition-all duration-200 ${
                      transferType === "gift"
                        ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
                        : "border-slate-200 hover:border-blue-300 hover:shadow-md"
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                          transferType === "gift" ? "bg-blue-500" : "bg-slate-100"
                        }`}
                      >
                        <Gift className={`w-6 h-6 ${transferType === "gift" ? "text-white" : "text-slate-600"}`} />
                      </div>
                      <span className={`font-semibold ${transferType === "gift" ? "text-blue-600" : "text-slate-700"}`}>
                        Gift
                      </span>
                      <span className="text-sm text-slate-500 mt-1">With message</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Amount Input */}
              <div className="mb-8">
                <label htmlFor="amount" className="block text-lg font-semibold text-slate-900 mb-4">
                  Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <span className="text-slate-500 text-xl font-semibold">Rp</span>
                  </div>
                  <input
                    type="text"
                    id="amount"
                    value={amount}
                    onChange={handleAmountChange}
                    className="pl-16 pr-6 py-4 w-full border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-2xl font-semibold transition-all duration-200"
                    placeholder="0"
                  />
                </div>
                {amount && <p className="mt-3 text-slate-600 text-lg">Rp {formatCurrency(amount)}</p>}
              </div>

              {/* Message Input */}
              <div className="mb-8">
                <label htmlFor="message" className="block text-lg font-semibold text-slate-900 mb-4">
                  Message {transferType === "gift" && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  className={`p-4 w-full border-2 rounded-xl focus:ring-4 transition-all duration-200 ${
                    transferType === "gift"
                      ? "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                      : "border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed"
                  }`}
                  rows="4"
                  placeholder={
                    transferType === "gift"
                      ? "Write a message for your gift..."
                      : "Message can only be added for Gift transfers"
                  }
                  required={transferType === "gift"}
                  disabled={transferType !== "gift"}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-start">
                  <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              <button
                onClick={goToConfirmation}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center text-lg font-semibold"
              >
                Continue to Review
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && selectedUser && (
          <div className="max-w-lg mx-auto">
            <button
              onClick={() => setFormData((prev) => ({ ...prev, step: 2 }))}
              className="flex items-center text-blue-600 mb-6 hover:text-blue-700 transition-colors duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Amount
            </button>

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Review Transfer</h1>
              <p className="text-slate-600">Please confirm the details below</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              {/* Transfer Summary */}
              <div className="space-y-6 mb-8">
                {/* Recipient */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mr-4">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">To</p>
                      <p className="font-semibold text-slate-900">{selectedUser.name}</p>
                      <p className="text-sm text-slate-600">{selectedUser.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Amount */}
                <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                  <p className="text-sm text-slate-500 mb-2">Amount</p>
                  <p className="text-4xl font-bold text-slate-900">Rp {formatCurrency(amount)}</p>
                </div>

                {/* Transfer Type */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center">
                    {transferType === "normal" ? (
                      <Send className="w-6 h-6 text-blue-600 mr-3" />
                    ) : (
                      <Gift className="w-6 h-6 text-blue-600 mr-3" />
                    )}
                    <div>
                      <p className="text-sm text-slate-500">Type</p>
                      <p className="font-semibold text-slate-900 capitalize">{transferType}</p>
                    </div>
                  </div>
                </div>

                {/* Message */}
                {message && (
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-sm text-slate-500 mb-2">Message</p>
                    <p className="text-slate-900">{message}</p>
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-start">
                  <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              <button
                onClick={handleTransfer}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-3" />
                    Send Transfer
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="max-w-lg mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              {success ? (
                <>
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-green-500" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Transfer Successful!</h2>
                  <p className="text-slate-600 text-lg mb-2">You have successfully sent</p>
                  <p className="text-2xl font-bold text-slate-900 mb-2">Rp {formatCurrency(amount)}</p>
                  <p className="text-slate-600 text-lg mb-8">
                    to <span className="font-semibold">{selectedUser.name}</span>
                    {transferType === "gift" && " as a gift"}
                  </p>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Transfer Failed</h2>
                  <p className="text-slate-600 text-lg mb-8">
                    {error || "An error occurred while processing the transfer"}
                  </p>
                </>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => {
                    resetForm();
                    window.location.reload();
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center font-semibold"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  New Transfer
                </button>
                <Link
                  to="/dashboard"
                  className="flex-1 bg-slate-100 text-slate-700 py-3 px-6 rounded-xl shadow hover:shadow-md hover:bg-slate-200 transition-all duration-200 flex items-center justify-center font-semibold"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
