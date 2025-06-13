class ExpenseRecord {
  final int id;
  final String amount;
  final String date;
  final String type;
  final String receiverPhone;
  final String receiverName;
  final String? message;

  ExpenseRecord({
    required this.id,
    required this.amount,
    required this.date,
    required this.type,
    required this.receiverPhone,
    required this.receiverName,
    this.message,
  });

  factory ExpenseRecord.fromJson(Map<String, dynamic> json) {
    return ExpenseRecord(
      id: json['id'] ?? 0,
      amount: json['amount'] ?? "0",
      date: json['date'] ?? DateTime.now().toIso8601String().split('T')[0],
      type: json['type'] ?? 'normal',
      receiverPhone: json['receiver_phone'] ?? "",
      receiverName: json['receiver_name'] ?? 'Unknown',
      message: json['message'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'amount': amount,
      'date': date,
      'type': type,
      'receiver_phone': receiverPhone,
      'receiver_name': receiverName,
      'message': message,
    };
  }
}
