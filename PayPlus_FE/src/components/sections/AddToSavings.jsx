import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ApiService } from '../../services/apiService.js';

export const AddToSavings = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [savingToEdit, setSavingToEdit] = useState(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSaving = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await ApiService.getSavings();
        if (response.success) {
          let data = [];
          if (Array.isArray(response.data)) {
            data = response.data;
          } 
          else if (response.data.savings && Array.isArray(response.data.savings)) {
            data = response.data.savings;
          } 
          else if (response.data.records && Array.isArray(response.data.records)) {
            data = response.data.records;
          } 
          else if (typeof response.data === 'object') {
            const possibleKeys = ['savings', 'records', 'data'];
            for (const key of possibleKeys) {
              if (response.data[key] && Array.isArray(response.data[key])) {
                data = response.data[key];
                break;
              }
            }
          }
          const saving = data.find((item) => String(item.id) === String(id));
          setSavingToEdit(saving || null);
        } else {
          setError(response.message || 'Failed to load savings data');
        }
      } catch (err) {
        setError('An error occurred while loading data');
      } finally {
        setLoading(false);
      }
    };
    fetchSaving();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!savingToEdit) return;
    setLoading(true);
    setError('');
    try {
      const response = await ApiService.addToSavings(savingToEdit.id, amount);
      if (response.success) {
        navigate('/savings');
      } else {
        setError(response.message || 'Failed to add funds to savings');
      }
    } catch (err) {
      setError('An error occurred while adding funds');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading data...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!savingToEdit) {
    return <p className="text-center text-red-500">Saving not found.</p>;
  }

  console.log('savingToEdit', savingToEdit);
  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link to="/dashboard">
                <img src="https://github.com/ThePayPlus/PayPlus_FE/blob/main/public/Logo.png?raw=true" alt="PayPlus Logo" className="h-10" />
              </Link>
            </div>
            <nav className="hidden sm:flex space-x-4">
              <Link to="/Dashboard" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">Dashboard</Link>
              <Link to="/Transfer" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">Transfer</Link>
              <Link to="/bills" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">Bills</Link>
              <Link to="/Expense" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">Expenses</Link>
              <Link to="/Income" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">Income</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Add to Savings</h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700">Name</p>
            <p className="text-lg font-semibold text-gray-800">{savingToEdit.namaSavings}</p>
          </div>
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700">Description</p>
            <p className="text-gray-600">{savingToEdit.deskripsi}</p>
          </div>
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-600">Target</p>
            <p className="text-lg font-semibold text-gray-700">Rp {Number(savingToEdit.target).toLocaleString('id-ID')}</p>
          </div>
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700">Current Amount Collected</p>
            <p className="text-lg font-semibold text-green-600">Rp {Number(savingToEdit.terkumpul).toLocaleString('id-ID')}</p>
          </div>
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount to Add (Rp)</label>
            <input
              name="amount"
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)} // Update state amount saat input berubah
              className="mt-1 p-2 w-full border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
              min="1"
            />
          </div>
          <button type="submit" className="w-full bg-green-500 text-white py-2 px-4 rounded shadow hover:bg-green-600" disabled={loading}>
            {loading ? 'Adding...' : 'Add Amount'}
          </button>
        </form>
      </main>
    </div>
  );
};