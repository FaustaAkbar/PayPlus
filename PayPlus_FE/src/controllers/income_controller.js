import Income from "../models/income_model";
import { ApiService } from "../services/apiService.js";

class IncomeController {

  static async getIncomeRecords() {
    const response = await ApiService.getIncomeRecords();
    
    if (response.success) {
      const incomeRecords = response.records.map(record => Income.fromJson(record));
      return {
        success: true,
        records: incomeRecords
      };
    } else {
      return {
        success: false,
        message: response.message
      };
    }
  }
  
  // Mengambil data income dan menyiapkan data untuk view
  static async fetchIncomeData() {
    const response = await this.getIncomeRecords();
    
    if (response.success) {
      const totalIncome = this.calculateTotalIncome(response.records);
      const normalIncome = this.calculateIncomeByType(response.records, "normal");
      const giftIncome = this.calculateIncomeByType(response.records, "gift");
      const topupIncome = this.calculateIncomeByType(response.records, "topup");
      
      return {
        success: true,
        data: {
          totalIncome,
          totalTransactions: response.records.length,
          normalIncome,
          giftIncome,
          topupIncome,
          incomeRecords: response.records,
        }
      };
    } else {
      return {
        success: false,
        message: response.message
      };
    }
  }

  // Menghitung total income dari records
  static calculateTotalIncome(records) {
    return records.reduce((acc, record) => acc + Number(record.amount), 0);
  }

  // Menghitung income berdasarkan tipe
  static calculateIncomeByType(records, type) {
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
  static prepareChartData(normalIncome, giftIncome, topupIncome) {
    return {
      labels: ["Normal Income", "Gift Income", "TopUp Income"],
      datasets: [
        {
          data: [normalIncome, giftIncome, topupIncome],
          backgroundColor: ["#3B82F6", "#8B5CF6", "#F1C40F"],
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

  // Mendapatkan class untuk tipe income
  static getIncomeTypeClass(type) {
    if (type === "gift") return "text-purple-600";
    if (type === "topup") return "text-green-600";
    return "text-blue-600";
  }

  // Kapitalisasi tipe income
  static capitalizeIncomeType(type) {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }
}

export default IncomeController;