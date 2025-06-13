import { ApiService } from '../services/apiService.js';
import { SavingsModel } from '../models/SavingsModel.js';

export class SavingsController {
  constructor() {
    this.savingsList = [];
    this.totalTarget = 0;
    this.totalCollected = 0;
    this.loading = true;
    this.error = '';
    this.alert = '';
    this.alertType = '';
    this.selectedSavings = null;
  }

  async fetchSavingsData() {
    try {
      this.loading = true;
      const response = await ApiService.getSavings();

      if (response.success) {
        let data = this._extractDataFromResponse(response);

        this.savingsList = data.map(item => new SavingsModel(item));
        this._calculateTotals();
        this.error = '';
        return {
          success: true,
          savingsList: this.savingsList,
          totalTarget: this.totalTarget,
          totalCollected: this.totalCollected
        };
      } else {
        this.error = response.message || 'Failed to load savings data';
        this.savingsList = [];
        return { success: false, error: this.error };
      }
    } catch (err) {
      this.error = 'An error occurred while loading data';
      console.error('Error when fetching savings data:', err);
      this.savingsList = [];
      return { success: false, error: this.error };
    } finally {
      this.loading = false;
    }
  }

  _extractDataFromResponse(response) {
    let data = [];

    if (response.data) {
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
    }

    return data;
  }

  _calculateTotals() {
    this.totalTarget = 0;
    this.totalCollected = 0;
    this.savingsList.forEach(s => {
      this.totalTarget += Number(s.target) || 0;
      this.totalCollected += Number(s.terkumpul) || 0;
    });
  }

  async deleteSavings(savingsId) {
    try {
      const response = await ApiService.deleteSavings(savingsId);
      if (response.success) {
        this.alert = 'Savings successfully deleted';
        this.alertType = 'success';
        await this.fetchSavingsData();
        return { success: true, message: this.alert };
      } else {
        this.alert = response.message || 'Failed to delete savings';
        this.alertType = 'error';
        return { success: false, message: this.alert };
      }
    } catch (err) {
      this.alert = 'An error occurred while deleting savings';
      this.alertType = 'error';
      console.error('Delete savings error:', err);
      return { success: false, message: this.alert };
    }
  }

  async transferToBalance(savingsId) {
    try {
      const response = await ApiService.deleteSavings(savingsId);
      if (response.success) {
        this.alert = 'Savings successfully transferred';
        this.alertType = 'transfer';
        await this.fetchSavingsData();
        return { success: true, message: this.alert, alertType: this.alertType };
      } else {
        this.alert = response.message || 'Failed to transfer savings';
        this.alertType = 'error';
        return { success: false, message: this.alert, alertType: this.alertType };
      }
    } catch (err) {
      this.alert = 'An error occurred during the savings transfer';
      this.alertType = 'error';
      console.error('Delete savings error:', err);
      return { success: false, message: this.alert, alertType: this.alertType };
    }
  }

  async updateSavingsTarget(savingsId, newTarget) {
    if (!savingsId || !newTarget) return { success: false, message: 'Incomplete data' };

    try {
      const response = await ApiService.updateSavingsTarget(savingsId, newTarget);

      if (response.success) {
        this.alert = 'Savings target successfully updated';
        this.alertType = 'success';
        await this.fetchSavingsData();
        return { success: true, message: this.alert, alertType: this.alertType };
      } else {
        this.alert = response.message || 'Failed to update savings target';
        this.alertType = 'error';
        return { success: false, message: this.alert, alertType: this.alertType };
      }
    } catch (err) {
      this.alert = 'An error occurred while updating the savings target';
      this.alertType = 'error';
      console.error('Update target error:', err);
      return { success: false, message: this.alert, alertType: this.alertType };
    }
  }

  setSelectedSavings(savings) {
    this.selectedSavings = savings;
    return savings;
  }

  getSelectedSavings() {
    return this.selectedSavings;
  }
}