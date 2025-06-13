// models/TransactionModel.js

class TransactionModel {
    constructor(amount, type, date, transactionType) {
      this.amount = parseFloat(amount);
      this.type = type;
      this.date = date;
      this.transactionType = transactionType;
    }
  
    static fromJson(json) {
      return new TransactionModel(json.amount, json.type, json.date, json.transactionType);
    }
  
    static groupByType(records) {
      return records.reduce((acc, record) => {
        const type = record.transactionType;
        acc[type] = acc[type] || [];
        acc[type].push(record);
        return acc;
      }, {});
    }
  
    static countTotal(records) {
      return records.length;
    }
  
    static calculateTotalAmount(records) {
      return records.reduce((sum, r) => sum + parseFloat(r.amount), 0);
    }
  
    static formatCurrency(amount) {
      return amount.toLocaleString('id-ID');
    }
  }
  
  export default TransactionModel;  