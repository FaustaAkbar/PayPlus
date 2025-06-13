class Savings {
  final int? id;
  final String title;
  final String description;
  final int target;
  final int collected;

  Savings({
    this.id,
    required this.title,
    required this.description,
    required this.target,
    required this.collected,
  });

  factory Savings.fromJson(Map<String, dynamic> json) {
    return Savings(
      id: json['id'] is int ? json['id'] : int.tryParse(json['id']?.toString() ?? '0'),
      title: json['nama'] ?? json['namaSavings'] ?? '',
      description: json['deskripsi'] ?? '',
      target: json['target'] is int ? json['target'] : int.tryParse(json['target']?.toString() ?? '0') ?? 0,
      collected: json['terkumpul'] is int ? json['terkumpul'] : int.tryParse(json['terkumpul']?.toString() ?? '0') ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'nama': title,
      'deskripsi': description,
      'target': target,
      'terkumpul': collected,
    };
  }
}