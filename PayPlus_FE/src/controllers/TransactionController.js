// controllers/TransactionController.js

import ApiService from '../services/apiService';
import TransactionModel from '../models/TransactionModel';

const TransactionController = {
  async fetchTransactionData() {
    const response = await ApiService.getTransactionHistory();

    if (!response.success) return { success: false, message: response.message };

    const records = response.records.map(TransactionModel.fromJson);
    const grouped = TransactionModel.groupByType(records);

    const totalIncome = TransactionModel.calculateTotalAmount(grouped.income || []);
    const totalExpense = TransactionModel.calculateTotalAmount(grouped.expense || []);

    return {
      success: true,
      data: {
        totalTransactions: TransactionModel.countTotal(records),
        totalIncome,
        totalExpense,
        transactionRecords: records,
      },
    };
  },

  formatCurrency: TransactionModel.formatCurrency,

  filterRecordsByType(records, type) {
    if (type === 'all') return records;
    return records.filter(r => r.transactionType === type);
  }
};

export default TransactionController;