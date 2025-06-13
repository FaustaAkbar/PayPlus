import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/history_controller.dart';

class HistoryView extends GetView<HistoryController> {
  const HistoryView({super.key});

  static const Color primaryColor = Color(0xFF6C63FF);
  static const Color primaryDarkColor = Color(0xFF4B0082);
  static const Color successColor = Color(0xFF4CAF50);
  static const Color dangerColor = Color(0xFFFF6B6B);
  static const Color textDarkColor = Color(0xFF1F2937);
  static const Color textMediumColor = Color(0xFF666666);
  static const Color bgColor = Color(0xFFF9FAFB);
  static const Color cardColor = Colors.white;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F4F8),
      appBar: AppBar(
        title: const Text('Transaction Histories',
            style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Get.offAllNamed('/home'),
        ),
      ),
      body: Obx(() {
        if (controller.isLoading.value) {
          return const Center(child: CircularProgressIndicator());
        }

        if (controller.errorMessage.isNotEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  controller.errorMessage.value,
                  style: const TextStyle(color: Colors.red),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () => controller.fetchHistoryRecords(),
                  child: const Text('Coba Lagi'),
                ),
              ],
            ),
          );
        }

        return SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'History Overview',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF333333),
                ),
              ),
              const SizedBox(height: 16),
              // List History Card
              _buildHistoryRecordsList(),
            ],
          ),
        );
      }),
    );
  }

  // Fungsi untuk menampilkan daftar riwayat transaksi dalam bentuk card
  Widget _buildHistoryRecordsList() {
    return Obx(() {
      final transactions = controller.historyRecords;
      if (transactions.isEmpty) {
        return Center(child: Text('Tidak ada transaksi terbaru.'));
      }
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Membuat card untuk setiap transaksi history
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: controller.historyRecords.length,
            itemBuilder: (context, index) {
              final data = controller.historyRecords[index];
              return _buildTransactionItem(
                icon: _getIconForType(data.type),
                title: data.type,
                date: data.date,
                amount: controller.formatCurrency(data.amount),
                isExpense: data.transactionType == 'expense' ? true : false,
              );
            },
          ),
        ],
      );
    });
  }

  // Card builder untuk satu item transaksi, menampilkan ikon, judul, tanggal, dan jumlah
  Widget _buildTransactionItem({
    required IconData icon,
    required String title,
    required String date,
    required String amount,
    required bool isExpense,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: isExpense
                    ? [dangerColor, dangerColor.withOpacity(0.8)]
                    : [successColor, successColor.withOpacity(0.8)],
              ),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(
              icon,
              color: Colors.white,
              size: 20,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: textDarkColor,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  date,
                  style: TextStyle(
                    fontSize: 12,
                    color: textMediumColor.withOpacity(0.8),
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: isExpense
                  ? dangerColor.withOpacity(0.1)
                  : successColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              isExpense ? '-$amount' : '+$amount',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: isExpense ? dangerColor : successColor,
              ),
            ),
          ),
        ],
      ),
    );
  }

  // Fungsi untuk mendapatkan ikon sesuai dengan tipe transaksi
  IconData _getIconForType(String? type) {
    switch (type) {
      case 'topup':
        return Icons.wallet;
      case 'gift':
        return Icons.card_giftcard;
      default:
        return Icons.receipt_long;
    }
  }
}
