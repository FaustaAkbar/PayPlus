import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ApiService } from '../../services/apiService.js';

export const AddSavings = () => {
  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: '',
    target: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { nama, deskripsi, target } = formData;
      
      if (!nama.trim()) {
        setError('The savings name cannot be blank.');
        setLoading(false);
        return;
      }
      
      if (!deskripsi.trim()) {
        setError('Description cannot be empty');
        setLoading(false);
        return;
      }
      
      if (!target || parseInt(target) <= 0) {
        setError('The target must be more than 0');
        setLoading(false);
        return;
      }

      const response = await ApiService.addSavings(nama, deskripsi, target);

      if (response.success) {
        setSuccess('Savings successfully added!');
        setFormData({
          nama: '',
          deskripsi: '',
          target: ''
        });
        
        setTimeout(() => {
          navigate('/savings');
        }, 2000);
      } else {
        setError(response.message || 'Failed to add savings');
      }
    } catch (err) {
      setError('An unexpected error has occurred');
      console.error('Add savings error:', err);
    } finally {
      setLoading(false);
    }
  };

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
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">Dashboard</Link>
              <Link to="/Transfer" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">Transfer</Link>
              <Link to="/bills" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">Bills</Link>
              <Link to="/Expense" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">Expenses</Link>
              <Link to="/Income" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">Income</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Add Savings</h1>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{success}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
          <div className="mb-4">
            <label htmlFor="nama" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              name="nama"
              id="nama"
              type="text"
              value={formData.nama}
              onChange={handleChange}
              required
              disabled={loading}
              className="mt-1 p-2 w-full border rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              placeholder="Example: Holiday"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="deskripsi"
              id="deskripsi"
              rows="3"
              value={formData.deskripsi}
              onChange={handleChange}
              required
              disabled={loading}
              className="mt-1 p-2 w-full border rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              placeholder="Description of your savings goals"
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="target" className="block text-sm font-medium text-gray-700">Target (Rp)</label>
            <input
              name="target"
              id="target"
              type="number"
              min="1"
              value={formData.target}
              onChange={handleChange}
              required
              disabled={loading}
              className="mt-1 p-2 w-full border rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              placeholder="Example: 5000000"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-2 px-4 rounded shadow transition-colors duration-200 ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            {loading ? 'Adding...' : 'Add'}
          </button>
        </form>
      </main>
    </div>
  );
};

