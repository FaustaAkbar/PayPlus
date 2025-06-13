'use client';

import { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import TransactionController from '../../controllers/TransactionController';
import { Link } from 'react-router-dom';

export const TransactionHistory = () => {
  const [transactionData, setTransactionData] = useState({
    totalTransactions: 0,
    totalIncome: 0,
    totalExpense: 0,
    transactionRecords: [],
  });

  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredRecords, setFilteredRecords] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await TransactionController.fetchTransactionData();
      if (response.success) {
        setTransactionData(response.data);
      } else {
        console.error(response.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setFilteredRecords(
      TransactionController.filterRecordsByType(
        transactionData.transactionRecords,
        activeFilter
      )
    );
  }, [activeFilter, transactionData.transactionRecords]);

  const formatRelativeDate = (dateStr) => {
    const today = new Date();
    const date = new Date(dateStr);
    const diffTime = today - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/dashboard">
            <img
              src="https://github.com/ThePayPlus/PayPlus_FE/blob/main/public/Logo.png?raw=true"
              alt="PayPlus Logo"
              className="h-10"
            />
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Transaction History</h1>

        <div className="grid gap-6 mb-8 md:grid-cols-3">
          <Card
            title="Total Income"
            value={`Rp. ${TransactionController.formatCurrency(transactionData.totalIncome)}`}
            color="green"
          />
          <Card
            title="Total Expense"
            value={`Rp. ${TransactionController.formatCurrency(transactionData.totalExpense)}`}
            color="red"
          />
          <Card
            title="Total Transactions"
            value={transactionData.totalTransactions}
            color="blue"
          />
        </div>

        <div className="mb-4">
          <label className="mr-4 font-medium text-gray-700">Filter by:</label>
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100">
            {filteredRecords.length === 0 ? (
              <div className="p-4 text-gray-600">No transactions available.</div>
            ) : (
              filteredRecords.map((record, idx) => {
                const isIncome = record.transactionType === 'income';
                const Icon = isIncome ? ArrowUpRight : ArrowDownLeft;
                const iconColor = isIncome ? 'text-green-600' : 'text-red-600';
                const bgColor = isIncome ? 'bg-green-100' : 'bg-red-100';
                const textColor = isIncome ? 'text-green-600' : 'text-red-600';
                const sign = isIncome ? '+' : '-';

                return (
                  <div
                    key={idx}
                    className="p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div className={`p-2 ${bgColor} rounded-md mr-3`}>
                        <Icon className={`w-4 h-4 ${iconColor}`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {record.type}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {record.transactionType}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${textColor}`}>
                        {sign}Rp.{' '}
                        {TransactionController.formatCurrency(record.amount)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatRelativeDate(record.date)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

function Card({ title, value, color }) {
  const colorMap = {
    green: 'text-green-600 bg-green-100',
    red: 'text-red-600 bg-red-100',
    blue: 'text-blue-600 bg-blue-100',
  };

  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow">
      <div className={`p-3 mr-4 rounded-full ${colorMap[color]}`}>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-lg font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}