import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../models/income_model.dart';
import 'package:payplus_mobile/services/api_service.dart';
import 'package:intl/intl.dart';

class IncomeController extends GetxController {
  var isLoading = false.obs;
  var incomeRecords = <Income>[].obs;
  var filteredRecords = <Income>[].obs;
  var errorMessage = ''.obs;

  var totalIncome = "0".obs;
  var normalIncome = "0".obs;
  var giftIncome = "0".obs;
  var topupIncome = "0".obs;
  var totalTransactions = 0.obs;
  var currentFilter = "all".obs;

  @override
  void onInit() {
    super.onInit();
    fetchIncomeRecords();
  }

  //## Untuk mengambil data income
  Future<void> fetchIncomeRecords() async {
    try {
      isLoading(true);
      errorMessage('');

      final result = await ApiService.getIncomeRecords();

      if (result['success'] == true) {
        final List<dynamic> records = result['records'] ?? [];
        incomeRecords.value =
            records.map((record) => Income.fromJson(record)).toList();

        // Menggunakan filter default untuk list income
        applyFilter(currentFilter.value);

        // Hitung total dan kategori income
        calculateIncomeStats();
      } else {
        errorMessage(result['message'] ?? 'Terjadi kesalahan');
      }
    } catch (e) {
      errorMessage('Terjadi kesalahan: ${e.toString()}');
    } finally {
      isLoading(false);
    }
  }

  //## Fungsi untuk menghitung total income dan kategori(normal, gift, topup)
  void calculateIncomeStats() {
    int total = 0;
    int normal = 0;
    int gift = 0;
    int topup = 0;

    for (var record in incomeRecords) {
      // Konversi amount ke int
      int amount = int.tryParse(record.amount) ?? 0;

      total += amount;

      switch (record.type) {
        case 'normal':
          normal += amount;
          break;
        case 'gift':
          gift += amount;
          break;
        case 'topup':
          topup += amount;
          break;
      }
    }

    totalIncome.value = total.toString();
    normalIncome.value = normal.toString();
    giftIncome.value = gift.toString();
    topupIncome.value = topup.toString();
    totalTransactions.value = incomeRecords.length;
  }

  //## Fungsi untuk menerapkan filter pada data income list
  void applyFilter(String filter) {
    currentFilter.value = filter;

    if (filter == 'all') {
      filteredRecords.value = incomeRecords;
    } else {
      filteredRecords.value =
          incomeRecords.where((record) => record.type == filter).toList();
    }
  }

  //## Fungsi untuk mengatur color berdasarkan tipe income
  Color getIncomeTypeColor(String type) {
    switch (type) {
      case 'normal':
        return Colors.blue;
      case 'gift':
        return Colors.purple;
      case 'topup':
        return Colors.amber;
      default:
        return Colors.grey;
    }
  }

  //## Fungsi untuk mengatur background color berdasarkan tipe income
  Color getIncomeTypeBackgroundColor(String type) {
    switch (type) {
      case 'normal':
        return Colors.blue.shade50;
      case 'gift':
        return Colors.purple.shade50;
      case 'topup':
        return Colors.amber.shade50;
      default:
        return Colors.grey.shade50;
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
