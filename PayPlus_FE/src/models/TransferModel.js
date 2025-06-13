export class TransferModel {
  constructor() {
    this.step = 1;
    this.searchQuery = '';
    this.searchResults = [];
    this.selectedUser = null;
    this.amount = '';
    this.message = '';
    this.loading = false;
    this.error = '';
    this.success = false;
    this.userData = null;
    this.transferType = 'normal';
  }

  setField(field, value) {
    this[field] = value;
  }

  getData() {
    return {
      step: this.step,
      searchQuery: this.searchQuery,
      searchResults: this.searchResults,
      selectedUser: this.selectedUser,
      amount: this.amount,
      message: this.message,
      loading: this.loading,
      error: this.error,
      success: this.success,
      userData: this.userData,
      transferType: this.transferType,
    };
  }
}