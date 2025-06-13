// models/Recent_Model.js

class RecentModel {
  constructor(amount, type, date, transactionType) {
    this.amount = parseFloat(amount);
    this.type = type;
    this.date = date;
    this.transactionType = transactionType;
  }

  static fromJson(json) {
    return new RecentModel(json.amount, json.type, json.date, json.transactionType);
  }

  static formatRelativeDate(dateStr) {
    const today = new Date();
    const date = new Date(dateStr);
    const diffTime = today - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  }

  static formatCurrency(amount) {
    return amount.toLocaleString('id-ID');
  }
}

export default RecentModel;