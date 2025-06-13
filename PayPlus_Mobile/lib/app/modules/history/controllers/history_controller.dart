import 'package:get/get.dart';
import 'package:payplus_mobile/app/models/recent_transaction.dart';
import 'package:payplus_mobile/services/api_service.dart';

class HistoryController extends GetxController {
  var isLoading = false.obs;
  var historyRecords = <RecentTransaction>[].obs;
  var errorMessage = ''.obs;

  var totalAmount = "0".obs;
  var totalHistory = 0.obs;

  @override
  void onInit() {
    super.onInit();
    fetchHistoryRecords();
  }
  
  // Fungsi untuk mengambil data riwayat transaksi
  Future<void> fetchHistoryRecords() async {
    try {
      isLoading(true);
      errorMessage('');
      // Ganti dengan method API yang sesuai
      final result = await ApiService.getTransactionHistory();
      if (result['success'] == true) {
        final List<dynamic> records = result['records'] ?? [];
        historyRecords.value = records.map((record) => RecentTransaction.fromJson(record)).toList();
      } else {
        errorMessage(result['message'] ?? 'Terjadi kesalahan');
      }
    } catch (e) {
      errorMessage('Terjadi kesalahan: ${e.toString()}');
    } finally {
      isLoading(false);
    }
  }

  // Fungsi untuk mengonversi angka menjadi format mata uang
  String formatCurrency(String amount) {
    // Format sederhana, bisa pakai intl jika perlu
    return 'Rp ${amount.replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]}.')}';
  }
}
