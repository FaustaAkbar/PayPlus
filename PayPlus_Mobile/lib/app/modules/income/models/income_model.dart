class Income {
  final int id;
  final String amount;
  final String senderPhone;
  final String senderName;
  final String type;
  final String date;
  final String? message;

  Income({
    required this.id,
    required this.amount,
    required this.senderPhone,
    required this.senderName,
    required this.type,
    required this.date,
    this.message,
  });

  factory Income.fromJson(Map<String, dynamic> json) {
    return Income(
      id: json['id'],
      amount: json['amount'],
      senderPhone: json['sender_phone'],
      senderName: json['sender_name'],
      type: json['type'],
      date: json['date'],
      message: json['message'],
    );
  }
}
