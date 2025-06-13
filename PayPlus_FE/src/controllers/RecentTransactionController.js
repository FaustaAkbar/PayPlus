// controllers/RecentTransactionController.js

import ApiService from '../services/apiService';
import RecentModel from '../models/Recent_Model';

const RecentTransactionController = {
  async fetchRecentTransactions() {
    const response = await ApiService.getRecentTransactions();

    if (!response.success) return { success: false, message: response.message };

    const records = response.records.map(RecentModel.fromJson);

    return {
      success: true,
      data: {
        recentTransactions: records,
      },
    };
  },

  formatCurrency: RecentModel.formatCurrency,
  formatRelativeDate: RecentModel.formatRelativeDate,
};

export default RecentTransactionController;