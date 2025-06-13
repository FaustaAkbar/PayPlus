import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SavingsController } from '../../controllers/SavingsController.js';
import { SavingsModel } from '../../models/SavingsModel.js';
import { Menu, X } from 'lucide-react';

export const SavingsPage = () => {
  const [controller] = useState(new SavingsController());
  const [savingsList, setSavingsList] = useState([]);
  const [alert, setAlert] = useState('');
  const [alertType, setAlertType] = useState('');
  const [totalTarget, setTotalTarget] = useState(0);
  const [totalCollected, setTotalCollected] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSavings, setSelectedSavings] = useState(null);
  const [newTarget, setNewTarget] = useState('');
  const [modalError, setModalError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    fetchSavingsData();
  }, []);

  const fetchSavingsData = async () => {
    setLoading(true);
    const result = await controller.fetchSavingsData();
    
    if (result.success) {
      setSavingsList(result.savingsList);
      setTotalTarget(result.totalTarget);
      setTotalCollected(result.totalCollected);
      setError('');
    } else {
      setError(result.error);
      setSavingsList([]);
    }
    
    setLoading(false);
  };

  const handleDeleteSavings = async (savingsId) => {
    if (window.confirm('Are you sure you want to delete these savings?')) {
      setLoading(true);
      const result = await controller.deleteSavings(savingsId);
      setAlert(result.message);
      setAlertType(result.alertType || '');
      
      if (result.success) {
        await fetchSavingsData();
        setTimeout(() => setAlert(''), 3000);
      } else {
        setLoading(false);
      }
    }
  };

  const transferToBalance = async (savingsId) => {
    if (window.confirm('Are you sure you want to transfer these savings to your balance?')) {
      setLoading(true);
      const result = await controller.transferToBalance(savingsId);
      setAlert(result.message);
      setAlertType(result.alertType || '');
      
      if (result.success) {
        await fetchSavingsData();
        setTimeout(() => { setAlert(''); setAlertType(''); }, 3000);
      } else {
        setLoading(false);
      }
    }
  };

  const handleShowEditModal = (savings) => {
    const selected = controller.setSelectedSavings(savings);
    setSelectedSavings(selected);
    setNewTarget(selected.target.toString());
    setShowEditModal(true);
  };

  const handleUpdateTarget = async () => {
    if (!selectedSavings || !newTarget) return;
    
    setModalError('');
    
    const targetValue = parseInt(newTarget);
    if (targetValue <= 0) {
      setModalError('The savings target cannot be 0 or negative.');
      return;
    }
    
    setLoading(true);
    const result = await controller.updateSavingsTarget(selectedSavings.id, newTarget);
    
    if (result.success) {
      setShowEditModal(false);
      setAlert(result.message);
      setAlertType(result.alertType || '');
      await fetchSavingsData();
      setTimeout(() => { setAlert(''); setAlertType(''); }, 3000);
    } else {
      setModalError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link to="/dashboard">
                <img src="https://github.com/ThePayPlus/PayPlus_FE/blob/main/public/Logo.png?raw=true" alt="PayPlus Logo" className="h-10" />
              </Link>
            </div>
            {/* Navigation */}
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
              <Link to="/income" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
                Income
              </Link>
              <Link to="/savings" className="text-indigo-600 font-medium border-b-2 border-indigo-600 hover:text-indigo-800 transition-colors duration-200">
                Savings
              </Link>
              <Link to="/friends" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
                Friends
              </Link>
            </nav>
            {/* Mobile menu button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              {mobileMenuOpen ? <X className="w-6 h-6 text-gray-600" /> : <Menu className="w-6 h-6 text-gray-600" />}
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
                <Link to="/income" className="text-gray-600 hover:text-gray-800 transition-colors duration-200" onClick={() => setMobileMenuOpen(false)}>
                  Income
                </Link>
                <Link to="/savings" className="text-indigo-600 font-medium border-b-2 border-indigo-600 hover:text-indigo-800 transition-colors duration-200" onClick={() => setMobileMenuOpen(false)}>
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

      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Alert Messages */}
        {alert && (
          <div className={`font-bold mb-8 p-4 rounded ${
            alertType === 'transfer' ? 'text-blue-800 bg-blue-100' :
            alertType === 'success' ? 'text-green-800 bg-green-100' :
            alertType === 'error' ? 'text-red-800 bg-red-100' :
            'text-gray-800 bg-gray-100'
          }`}>
            {alert}
          </div>
        )}
        
        {error && (
          <div className="font-bold mb-8 text-red-800 bg-red-100 p-4 rounded">
            {error}
          </div>
        )}

        <h1 className="text-3xl font-bold mb-8 text-gray-800">Savings Page</h1>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Memuat data savings...</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-2">
              <div className="flex items-center p-4 bg-white rounded-lg shadow">
                <div className="p-3 mr-4 text-green-500 bg-green-100 rounded-full">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.211 6.339A8 8 0 1 1 6.339 2.789a4.5 4.5 0 1 0 10.872 3.55Z"></path>
                  </svg>
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-600">Total Savings Target</p>
                  <p id="totalSavings" className="text-lg font-semibold text-gray-700">
                    {SavingsModel.formatCurrency(totalTarget)}
                  </p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-white rounded-lg shadow">
                <div className="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.211 6.339A8 8 0 1 1 6.339 2.789a4.5 4.5 0 1 0 10.872 3.55Z"></path>
                  </svg>
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-600">Savings Collected</p>
                  <p id="savingsCollected" className="text-lg font-semibold text-gray-700">
                    {SavingsModel.formatCurrency(totalCollected)}
                  </p>
                </div>
              </div>
            </div>

            <Link to="/addsavings">
              <button id="addSavingsButton" className="mb-4 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600">
                Add Savings
              </button>
            </Link>

            <div id="savingsContainer" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {savingsList.length > 0 ? (
                savingsList.map(s => (
                  <div className="bg-white rounded-lg shadow-md p-6" key={s.id}>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{s.namaSavings}</h3>
                    <p className="text-gray-600 mb-4">{s.deskripsi}</p>
                    <div className="mb-2">
                      <p className="text-sm font-medium text-gray-500">Target</p>
                      <p className="text-lg font-semibold text-gray-700">{SavingsModel.formatCurrency(s.target)}</p>
                    </div>
                    <div className="mb-2">
                      <p className="text-sm font-medium text-gray-500">Amount Collected</p>
                      <p className="text-lg font-semibold text-green-600">{SavingsModel.formatCurrency(s.terkumpul)}</p>
                    </div>
                    {!s.isTargetAchieved() ? (
                      <>
                        <Link to={`/addtosavings/${s.id}`}>
                          <button className="mt-4 mr-2 bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600">
                            Add to Savings
                          </button>
                        </Link>
                        <button 
                          onClick={() => handleShowEditModal(s)}
                          className="mt-4 mr-2 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                        >
                          Edit Target
                        </button>
                        <button 
                          onClick={() => handleDeleteSavings(s.id)}
                          className="mt-4 bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="text-lg font-semibold text-green-600">Target achieved!</p>
                        <button 
                          onClick={() => transferToBalance(s.id)}
                          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-800"
                        >
                          Transfer to balance
                        </button>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <span className="text-gray-700">You have no savings.</span>
                </div>
              )}
            </div>
          </>
        )}
      </main>
      
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-purple-600">Edit Target</h2>
            
            {modalError && (
              <div className="mb-4 text-red-600 bg-red-100 p-3 rounded">
                {modalError}
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newTarget">
                New Target
              </label>
              <input
                id="newTarget"
                type="number"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value)}
                min="0"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                className="mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                onClick={() => {
                  setShowEditModal(false);
                  setModalError('');
                }}
              >
                Batal
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleUpdateTarget}
              >
                Simpan
              </button>
            </div>
          </div>
          <div 
            className="fixed inset-0 -z-10" 
            onClick={() => {
              setShowEditModal(false);
              setModalError('');
            }}
          ></div>
        </div>
      )}
    </div>
  );
};
