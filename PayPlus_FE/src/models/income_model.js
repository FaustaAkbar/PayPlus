class Income {
  constructor(id, amount, senderPhone, senderName, type, date, message) {
    this.id = id;
    this.amount = amount;
    this.senderPhone = senderPhone;
    this.senderName = senderName;
    this.type = type;
    this.date = date;
    this.message = message;
  }

  static fromJson(json) {
    return new Income(
      json.id,
      json.amount,
      json.sender_phone,
      json.sender_name,
      json.type,
      json.date,
      json.message
    );
  }
}

export default Income;