class Bill {
  final int id;
  final String name;
  final double amount;
  final DateTime dueDate;
  final String category;
  final String icon;

  Bill({
    required this.id,
    required this.name,
    required this.amount,
    required this.dueDate,
    required this.category,
    this.icon = '',
  });

  bool get isOverdue => DateTime.now().isAfter(dueDate);
  
  bool get isDueTomorrow {
    final now = DateTime.now();
    final tomorrow = DateTime(now.year, now.month, now.day + 1);
    final dueDateNormalized = DateTime(dueDate.year, dueDate.month, dueDate.day);
    return dueDateNormalized.isAtSameMomentAs(tomorrow);
  }
  
  int get daysOverdue {
    if (!isOverdue) return 0;
    return DateTime.now().difference(dueDate).inDays;
  }
  
  // Factory method to create a Bill from JSON
  factory Bill.fromJson(Map<String, dynamic> json) {
    return Bill(
      id: json['id'],
      name: json['name'] ?? '',
      amount: (json['amount'] ?? 0).toDouble(),
      dueDate: json['dueDate'] != null 
          ? DateTime.parse(json['dueDate']) 
          : DateTime.now(),
      category: json['category'] ?? 'Other',
    );
  }
  
  // Convert Bill to JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'amount': amount,
      'dueDate': dueDate.toIso8601String().split('T')[0],
      'category': category,
    };
  }
}