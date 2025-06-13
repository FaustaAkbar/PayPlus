"use client"

import { useState, useEffect } from "react"
import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { Link } from "react-router-dom"
import IncomeController from "../../controllers/income_controller"
import { Menu, X } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend)

export default function Income() {
  const [incomeData, setIncomeData] = useState({
    totalIncome: 0,
    totalTransactions: 0,
    normalIncome: 0,
    giftIncome: 0,
    topupIncome: 0,
    incomeRecords: [],
  })

  const [activeFilter, setActiveFilter] = useState("all")
  const [filteredRecords, setFilteredRecords] = useState([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const fetchIncomeRecords = async () => {
      const response = await IncomeController.fetchIncomeData();
      if (response.success) {
        setIncomeData(response.data);
      } else {
        console.error(response.message);
      }
    };

    fetchIncomeRecords();
  }, []);

  useEffect(() => {
    setFilteredRecords(IncomeController.filterRecordsByType(incomeData.incomeRecords, activeFilter))
  }, [activeFilter, incomeData.incomeRecords])

  const chartData = IncomeController.prepareChartData(
    incomeData.normalIncome, 
    incomeData.giftIncome, 
    incomeData.topupIncome
  );
  
  const chartOptions = IncomeController.getChartOptions();

  return (
    <div className="bg-gray-50 min-h-screen">
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
              <Link to="/topUp" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
                Top-Up
              </Link>
              <Link to="/transfer" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
                Transfer
              </Link>
              <Link to="/bills" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
                Bills
              </Link>
              <Link to="/expense" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
                Expenses
              </Link>
              <Link to="/income" className="text-indigo-600 font-medium border-b-2 border-indigo-600 hover:text-indigo-800 transition-colors duration-200">
                Income
              </Link>
              <Link to="/savings" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
                Savings
              </Link>
              <Link to="/friends" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
                Friends
              </Link>
            </nav>
            {/* Mobile menu button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="sm:hidden py-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-4">
                <Link to="/topUp" className="text-gray-600 hover:text-gray-800 transition-colors duration-200" onClick={() => setMobileMenuOpen(false)}>
                  Top-Up
                </Link>
                <Link to="/transfer" className="text-gray-600 hover:text-gray-800 transition-colors duration-200" onClick={() => setMobileMenuOpen(false)}>
                  Transfer
                </Link>
                <Link to="/bills" className="text-gray-600 hover:text-gray-800 transition-colors duration-200" onClick={() => setMobileMenuOpen(false)}>
                  Bills
                </Link>
                <Link to="/expense" className="text-gray-600 hover:text-gray-800 transition-colors duration-200" onClick={() => setMobileMenuOpen(false)}>
                  Expenses
                </Link>
                <Link to="/income" className="text-indigo-600 font-medium border-b-2 border-indigo-600 hover:text-indigo-800 transition-colors duration-200" onClick={() => setMobileMenuOpen(false)}>
                  Income
                </Link>
                <Link to="/savings" className="text-gray-600 hover:text-gray-800 transition-colors duration-200" onClick={() => setMobileMenuOpen(false)}>
                  Savings
                </Link>
                <Link to="/friends" className="text-gray-600 hover:text-gray-800 transition-colors duration-200" onClick={() => setMobileMenuOpen(false)}>
                  Friends
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Income Overview</h1>

        {/* Total Income Card */}
        <div className="grid gap-6 mb-8 md:grid-cols-1 xl:grid-cols-1">
          <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow-xs">
            <div className="p-3 mr-4 text-green-500 bg-green-100 rounded-full">
              <svg className="w-5 h-5" fill="currentColor" viewBox="1 1 22 22">
                <path
                  fillRule="evenodd"
                  d="M7 6a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-2v-4a3 3 0 0 0-3-3H7V6Z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M2 11a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7Zm7.5 1a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"
                  clipRule="evenodd"
                />
                <path d="M10.5 14.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
              </svg>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-600">Total Income</p>
              <p id="totalIncome" className="text-lg font-semibold text-gray-700">
                Rp. {IncomeController.formatCurrency(incomeData.totalIncome)}
              </p>
            </div>
          </div>
        </div>

        {/* Income Stats Cards */}
        <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
          {/* Total Transactions */}
          <div className="flex items-center p-4 bg-white rounded-lg shadow-xs">
            <div className="p-3 mr-4 text-orange-500 bg-orange-100 rounded-full">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
              </svg>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-600">Total Transactions</p>
              <p id="totalTransactions" className="text-lg font-semibold text-gray-700">
                {incomeData.totalTransactions}
              </p>
            </div>
          </div>

          {/* Normal Income */}
          <div className="flex items-center p-4 bg-white rounded-lg shadow-xs">
            <div className="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
              </svg>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-600">Normal Income</p>
              <p id="normalIncome" className="text-lg font-semibold text-gray-700">
                Rp. {IncomeController.formatCurrency(incomeData.normalIncome)}
              </p>
            </div>
          </div>

          {/* Gift Income */}
          <div className="flex items-center p-4 bg-white rounded-lg shadow-xs">
            <div className="p-3 mr-4 text-purple-500 bg-purple-100 rounded-full">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z"
                  clipRule="evenodd"
                ></path>
                <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z"></path>
              </svg>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-600">Gift Income</p>
              <p id="giftIncome" className="text-lg font-semibold text-gray-700">
                Rp. {IncomeController.formatCurrency(incomeData.giftIncome)}
              </p>
            </div>
          </div>

          {/* TopUp Income */}
          <div className="flex items-center p-4 bg-white rounded-lg shadow-xs">
            <div className="p-3 mr-4 text-yellow-500 bg-yellow-100 rounded-full">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12 14a3 3 0 0 1 3-3h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-4a3 3 0 0 1-3-3Zm3-1a1 1 0 1 0 0 2h4v-2h-4Z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M12.293 3.293a1 1 0 0 1 1.414 0L16.414 6h-2.828l-1.293-1.293a1 1 0 0 1 0-1.414ZM12.414 6 9.707 3.293a1 1 0 0 0-1.414 0L5.586 6h6.828ZM4.586 7l-.056.055A2 2 0 0 0 3 9v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2h-4a5 5 0 0 1 0-10h4a2 2 0 0 0-1.53-1.945L17.414 7H4.586Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-600">TopUp Income</p>
              <p id="totalIncome" className="text-lg font-semibold text-gray-700">
                Rp. {IncomeController.formatCurrency(incomeData.topupIncome)}
              </p>
            </div>
          </div>
        </div>

        {/* Income Distribution Chart */}
        <div className="mb-8 bg-white rounded-lg shadow-xs p-4 flex flex-col items-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Income Distribution</h2>
          <div style={{ width: "300px", height: "150px" }}>
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="flex justify-between items-center mb-6 flex-wrap">
          <h2 className="text-2xl font-semibold text-gray-800">Recent Transactions</h2>
          <div className="space-x-2 mt-2 sm:mt-0">
            <button
              onClick={() => setActiveFilter("all")}
              className={`filter-btn px-4 py-2 rounded-md transition-all duration-300 hover:bg-blue-500 hover:text-white ${
                activeFilter === "all" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter("normal")}
              className={`filter-btn px-4 py-2 rounded-md transition-all duration-300 hover:bg-blue-500 hover:text-white ${
                activeFilter === "normal" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              Normal
            </button>
            <button
              onClick={() => setActiveFilter("gift")}
              className={`filter-btn px-4 py-2 rounded-md transition-all duration-300 hover:bg-blue-500 hover:text-white ${
                activeFilter === "gift" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              Gift
            </button>
            <button
              onClick={() => setActiveFilter("topup")}
              className={`filter-btn px-4 py-2 rounded-md transition-all duration-300 hover:bg-blue-500 hover:text-white ${
                activeFilter === "topup" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              TopUp
            </button>
          </div>
        </div>

        {/* Income Cards */}
        <div id="incomeCards" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRecords.length > 0 ? (
            filteredRecords.map((income, index) => (
              <div
                key={income.id}
                className="bg-white shadow rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg income-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-gray-800">
                      Rp. {IncomeController.formatCurrency(income.amount)}
                    </span>
                    <span className="text-sm font-medium text-gray-500">{income.date}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sender:</span>
                      <span className="font-medium text-gray-800">{income.senderName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Type:</span>
                      <span className={`font-medium ${IncomeController.getIncomeTypeClass(income.type)}`}>
                        {IncomeController.capitalizeIncomeType(income.type)}
                      </span>
                    </div>
                    {income.type === "gift" && income.message && (
                      <div className="mt-4">
                        <span className="text-sm text-gray-600">Message:</span>
                        <p className="mt-1 text-sm text-gray-800">{income.message}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-3 text-center text-gray-600">No income records found.</p>
          )}
        </div>
      </main>

      <style>{`
        .income-card {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.3s ease forwards;
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .filter-btn {
          transition: background-color 0.3s, color 0.3s;
        }
      `}</style>
    </div>
  )
}
