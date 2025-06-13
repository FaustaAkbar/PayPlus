import { ApiService } from '../services/apiService.js';
import { TransferModel } from '../models/TransferModel.js';

export class TransferController {
  constructor() {
    this.model = new TransferModel();
  }

  updateField(name, value) {
    this.model.setField(name, value);
    return this.model.getData();
  }

  async fetchUserData() {
    try {
      const profileResponse = await ApiService.getProfile();
      if (profileResponse.success) {
        this.model.setField('userData', profileResponse.data);
      }
      return this.model.getData();
    } catch (error) {
      throw error;
    }
  }

  async searchUser(searchQuery) {
    if (!searchQuery.trim()) return { error: 'Search query is empty' };

    try {
      const response = await ApiService.searchUser(searchQuery);
      if (response.success && response.data) {
        // Prevent transfer to self
        if (
          this.model.userData &&
          response.data.phone === this.model.userData.phone
        ) {
          return { error: 'You cannot transfer money to your own account', results: [] };
        } else {
          return { results: [response.data] };
        }
      } else {
        return { error: 'User not found', results: [] };
      }
    } catch (err) {
      return { error: 'An error occurred while searching for user', results: [] };
    }
  }

  validateAmount(amount) {
    const maxAmount = 1000000000;
    if (!amount || parseInt(amount) <= 0) {
      return { valid: false, message: 'Please enter a valid amount' };
    }
    if (parseInt(amount) > maxAmount) {
      return { valid: false, message: 'Maximum transfer amount is 1,000,000,000' };
    }
    return { valid: true };
  }

  async transferMoney(selectedUser, amount, transferType, message) {
    try {
      const response = await ApiService.transferMoney(
        selectedUser.phone,
        parseInt(amount),
        transferType,
        message
      );
      return response;
    } catch (err) {
      return { success: false, message: 'An error occurred while processing the transfer' };
    }
  }
}