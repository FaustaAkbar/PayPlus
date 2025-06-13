import 'package:get/get.dart';
import 'package:flutter/material.dart';
import 'package:payplus_mobile/app/models/expense_record_model.dart';
import 'package:payplus_mobile/services/api_service.dart';

class ExpenseController extends GetxController {
  var isLoading = false.obs;
  var expenseRecords = <ExpenseRecord>[].obs;
  var filteredRecords = <ExpenseRecord>[].obs;
  var errorMessage = ''.obs;
  
  // Nilai default untuk menghindari null
  var totalExpense = "0".obs;
  var normalExpense= "0".obs;
  var giftExpense= "0".obs;
  var totalTransactions = 0.obs;
  var currentFilter = "all".obs;

  @override
  void onInit() {
    super.onInit();
    fetchExpenseRecords();
  }

  // Fungsi untuk mengambil data riwayat pengeluaran
  Future<void> fetchExpenseRecords() async {
    try {
      isLoading(true);
      errorMessage('');
      
      final result = await ApiService.getExpenseRecords();
      
      if (result['success'] == true) {
        final List<dynamic> records = result['records'] ?? [];
        expenseRecords.value = records.map((record) => ExpenseRecord.fromJson(record)).toList();
        
        // Terapkan filter default
        applyFilter(currentFilter.value);
        
        // Hitung total dan kategori income
        calculateExpenseStats();
      } else {
        errorMessage(result['message'] ?? 'Terjadi kesalahan');
      }
    } catch (e) {
      errorMessage('Terjadi kesalahan: ${e.toString()}');
    } finally {
      isLoading(false);
    }
  }

  // Fungsi untuk menghitung total expense, transactions, dan type-specific expenses
  void calculateExpenseStats() {
    double total = 0;
    double normal = 0;
    double gift = 0;

    for (var record in expenseRecords) {      
      int amount = int.tryParse(record.amount) ?? 0;

      total += amount;

      switch (record.type) {
        case 'normal':
          normal += amount;
          break;
        case 'gift':
          gift += amount;
          break;
      }
    }

    totalExpense.value = total.toString();
    totalTransactions.value = expenseRecords.length;
    normalExpense.value = normal.toString();
    giftExpense.value = gift.toString();
  }

  // Fungsi untuk menerapkan filter berdasarkan jenis pengeluaran
  void applyFilter(String filter) {
    currentFilter.value = filter;

    if (filter == 'all') {
      filteredRecords.value = expenseRecords;
    } else {
      filteredRecords.value = expenseRecords.where((record) => record.type == filter).toList();
    }
  }

  // Fungsi untuk mendapatkan label sesuai dengan jenis pengeluaran
  String getExpenseTypeLabel(String type) {
    switch (type) {
      case 'normal':
        return 'Transfer';
      case 'gift':
        return 'Hadiah';
      default:
        return 'Lainnya';
    }
  }

  // Fungsi untuk mendapatkan warna sesuai dengan jenis pengeluaran
  Color getExpenseTypeColor(String type) {
    switch (type) {
      case 'normal':
        return Colors.blue;
      case 'gift':
        return Colors.purple;
      default:
        return Colors.grey;
    }
  }

  // Fungsi untuk mendapatkan warna latar belakang sesuai dengan jenis pengeluaran
  Color getExpenseTypeBackgroundColor(String type) {
    switch (type) {
      case 'normal':
        return Colors.blue.shade100;
      case 'gift':
        return Colors.purple.shade100;
      default:
        return Colors.grey.shade100;
    }
  }

  // Fungsi untuk mengonversi angka menjadi format mata uang
  String formatCurrency(String amount) {
    try {
      final value = int.parse(amount);
      return 'Rp ${value.toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]}.')}';
    } catch (e) {
      return 'Rp 0';
    }
  }
}