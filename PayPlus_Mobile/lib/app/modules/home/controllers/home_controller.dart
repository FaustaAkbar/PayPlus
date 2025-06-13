import 'package:get/get.dart';
import 'package:intl/intl.dart';
import 'package:payplus_mobile/app/models/recent_transaction.dart';
import 'package:payplus_mobile/services/api_service.dart';

class HomeController extends GetxController {
  var name = ''.obs;
  var totalIncome = ''.obs;
  var balance = ''.obs;
  var totalExpense = ''.obs;
  var isLoading = false.obs;
  var errorMessage = ''.obs;

  var recentTransactions = <RecentTransaction>[].obs;

  @override
  void onInit() {
    super.onInit();
    fetchProfileData();
    fetchRecentTransactions();
  }

  //## Untuk mengambil data recent transaction
  Future<void> fetchRecentTransactions() async {
    try {
      isLoading(true);
      errorMessage('');

      final result = await ApiService.getRecentTransactions();
      if (result['success'] == true) {
        final List<dynamic> records = result['records'] ?? [];
        recentTransactions.value = records
            .map((record) => RecentTransaction.fromJson(record))
            .toList();
      } else {
        errorMessage(result['message'] ?? 'Terjadi kesalahan');
      }
    } catch (e) {
      errorMessage('Terjadi kesalahan: ${e.toString()}');
    } finally {
      isLoading(false);
    }
  }

  //## Untuk mengambil data user
  void fetchProfileData() async {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      final result = await ApiService.getProfile();
      if (result['success']) {
        final data = result['data'];
        name.value = data['name'];
        balance.value = formatCurrency((data['balance'] ?? 0).toString());
        totalIncome.value =
            formatCurrency((data['total_income'] ?? 0).toString());
        totalExpense.value =
            formatCurrency((data['total_expense'] ?? 0).toString());
      } else {
        errorMessage.value = 'Failed to load profile data';
      }
    } catch (e) {
      errorMessage.value = 'Error: ${e.toString()}';
    } finally {
      isLoading.value = false;
    }
  }

  //## Fungsi untuk format mata uang indonesia
  String formatCurrency(String amount) {
    final value = int.tryParse(amount) ?? 0;
    final formatter =
        NumberFormat.currency(locale: 'id_ID', symbol: 'Rp ', decimalDigits: 0);
    return formatter.format(value);
  }
}
