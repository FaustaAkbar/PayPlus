import { ApiService } from '../services/apiService.js';

class Bill {
  constructor(id, name, amount, dueDate, category) {
    this.id = id;
    this.name = name;
    this.amount = amount;
    this.dueDate = dueDate;
    this.category = category;
  }

  static fromJson(json) {
    return new Bill(
      json.id,
      json.name,
      json.amount,
      json.dueDate,
      json.category
    );
  }

  static async getBills() {
    try {
      const response = await ApiService.getBills();
      if (response.success && response.data && response.data.bills) {
        response.data.bills = response.data.bills.map(bill => Bill.fromJson(bill));
      }
      return response;
    } catch (err) {
      console.error("Error in Bill.getBills:", err);
      return { success: false, message: "Terjadi kesalahan yang tidak terduga" };
    }
  }

  static async addBill(name, amount, dueDate, category) {
    try {
      const response = await ApiService.addBill(name, amount, dueDate, category);
      if (response.success && response.data && response.data.bill) {
        response.data.bill = Bill.fromJson(response.data.bill);
      }
      return response;
    } catch (err) {
      console.error("Error in Bill.addBill:", err);
      return { success: false, message: "Terjadi kesalahan saat menambahkan tagihan" };
    }
  }

  static async updateBill(billId, name, amount, dueDate, category) {
    try {
      const response = await ApiService.updateBill(billId, name, amount, dueDate, category);
      if (response.success && response.data && response.data.bill) {
        response.data.bill = Bill.fromJson(response.data.bill);
      }
      return response;
    } catch (err) {
      console.error("Error in Bill.updateBill:", err);
      return { success: false, message: "Terjadi kesalahan saat memperbarui tagihan" };
    }
  }

  static async deleteBill(billId) {
    try {
      return await ApiService.deleteBill(billId);
    } catch (err) {
      console.error("Error in Bill.deleteBill:", err);
      return { success: false, message: "Terjadi kesalahan saat menghapus tagihan" };
    }
  }
}
export default Bill;