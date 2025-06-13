import Expense from "../models/ExpenseModel";
import { ApiService } from "../services/apiService.js";

class ExpenseController {
  // Mengambil data expense dari API dan mengkonversi ke model Expense
  static async getExpenseRecords() {
    const response = await ApiService.getExpenseRecords();
    
    if (response.success) {
      // Convert raw data to Expense model instances
      const expenseRecords = response.records.map(record => Expense.fromJson(record));
      return {
        success: true,
        records: expenseRecords
      };
    } else {
      return {
        success: false,
        message: response.message
      };
    }
  }
  
  // Mengambil data expense dan menyiapkan data untuk view
  static async fetchExpenseData() {
    const response = await this.getExpenseRecords();
    
    if (response.success) {
      const totalExpense = this.calculateTotalExpense(response.records);
      const normalExpense = this.calculateExpenseByType(response.records, "normal");
      const giftExpense = this.calculateExpenseByType(response.records, "gift");
      
      return {
        success: true,
        data: {
          totalExpense,
          totalTransactions: response.records.length,
          normalExpense,
          giftExpense,
          expenseRecords: response.records,
        }
      };
    } else {
      return {
        success: false,
        message: response.message
      };
    }
  }

  // Menghitung total expense dari records
  static calculateTotalExpense(records) {
    return records.reduce((acc, record) => acc + Number(record.amount), 0);
  }

  // Menghitung expense berdasarkan tipe
  static calculateExpenseByType(records, type) {
    return records
      .filter(record => record.type === type)
      .reduce((acc, record) => acc + Number(record.amount), 0);
  }

  // Memfilter records berdasarkan tipe
  static filterRecordsByType(records, type) {
    if (type === "all") {
      return records;
    }
    return records.filter((record) => record.type === type);
  }

  // Format currency untuk tampilan
  static formatCurrency(amount) {
    return new Intl.NumberFormat("id-ID", {
      style: "decimal",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  // Menyiapkan data untuk chart
  static prepareChartData(normalExpense, giftExpense) {
    return {
      labels: ["Normal Expense", "Gift Expense"],
      datasets: [
        {
          data: [normalExpense, giftExpense],
          backgroundColor: ["#3B82F6", "#8B5CF6"],
          hoverOffset: 4,
        },
      ],
    };
  }

  // Menyiapkan opsi untuk chart
  static getChartOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 12,
            padding: 10,
          },
        },
      },
    };
  }

  // Mendapatkan class untuk tipe expense
  static getExpenseTypeClass(type) {
    if (type === "gift") return "text-purple-600";
    if (type === "topup") return "text-green-600";
    return "text-blue-600";
  }

  // Kapitalisasi tipe expense
  static capitalizeExpenseType(type) {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }
}

export default ExpenseController;