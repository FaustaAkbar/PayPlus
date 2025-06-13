class Expense {
    constructor(id, amount, receiverPhone, receiverName, type, date, message) {
      this.id = id;
      this.amount = amount;
      this.receiverPhone = receiverPhone;
      this.receiverName = receiverName;
      this.type = type;
      this.date = date;
      this.message = message;
    }
  
    static fromJson(json) {
      return new Expense(
        json.id,
        json.amount,
        json.receiver_phone,
        json.receiver_name,
        json.type,
        json.date,
        json.message
      );
    }
  }
  
  export default Expense;