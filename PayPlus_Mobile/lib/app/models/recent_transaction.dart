class RecentTransaction {
  final String amount;
  final String type;
  final String date;
  final String transactionType;

  RecentTransaction({
    required this.amount,
    required this.type,
    required this.date,
    required this.transactionType,
  });

  factory RecentTransaction.fromJson(Map<String, dynamic> json) {
    return RecentTransaction(
      amount: json['amount'],
      type: json['type'],
      date: json['date'],
      transactionType: json['transactionType'],
    );
  }
}
