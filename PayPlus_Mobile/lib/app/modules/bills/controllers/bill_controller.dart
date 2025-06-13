import 'dart:async';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import '../../../models/bill_model.dart';
import 'package:payplus_mobile/services/api_service.dart';

class BillController extends GetxController {
  final bills = <Bill>[].obs;
  final isLoading = false.obs;
  final errorMessage = ''.obs;

  // Form controllers
  final nameController = TextEditingController();
  final amountController = TextEditingController();
  final dateController = TextEditingController();
  final categories = ['Rent', 'Utilities', 'Insurance', 'Vehicle', 'Heart', 'Electricity', 'Other'];
  final selectedCategory = RxString('Rent');
  final selectedDate = Rx<DateTime?>(null);
  Timer? _notificationTimer;

  // map untuk menyimpan icon berdasarkan kategori
  final Map<String, IconData> categoryIcons = {
    'Rent': Icons.home,
    'Utilities': Icons.bolt,
    'Insurance': Icons.shield,
    'Vehicle': Icons.directions_car,
    'Heart': Icons.favorite,
    'Electricity': Icons.bolt,
    'Other': Icons.receipt,
  };
  
  final selectedIcon = Rx<IconData>(Icons.home);
  
  @override
  void onInit() {
    super.onInit();
    fetchBills();

    // Set up timer to check for notifications every 1 minutes
    _notificationTimer = Timer.periodic(const Duration(minutes: 1), (_) {
      checkBillNotifications();
    });

    // Also check immediately on startup
    WidgetsBinding.instance.addPostFrameCallback((_) {
      checkBillNotifications();
    });
    
    // listener untuk mengubah icon saat kategori berubah
    ever(selectedCategory, (category) {
      updateSelectedIcon(category);
    });
  }
  
  // Metode untuk memperbarui icon berdasarkan kategori
  void updateSelectedIcon(String category) {
    // Perbaikan: Gunakan categoryIcons langsung, bukan getCategoryIcon
    selectedIcon.value = categoryIcons[category] ?? Icons.receipt;
  }

  @override
  void onClose() {
    _notificationTimer?.cancel();
    nameController.dispose();
    amountController.dispose();
    dateController.dispose();
    super.onClose();
  }

  Future<void> fetchBills() async {
    isLoading.value = true;
    errorMessage.value = '';
    
    try {
      final result = await ApiService.getBills();
      
      if (result['success']) {
        final dynamic billsData = result['data'];
        
        if (billsData is List) {
          // Jika data adalah List, proses seperti biasa
          bills.value = billsData.map((data) => Bill.fromJson(data)).toList();
        } else if (billsData is Map) {
          // Jika data adalah Map, periksa apakah ada kunci 'bills' atau kunci lain yang berisi List
          if (billsData.containsKey('bills') && billsData['bills'] is List) {
            bills.value = (billsData['bills'] as List).map((data) => Bill.fromJson(data)).toList();
          } else {
            bills.clear();
          }
        } else {
          bills.clear();
        }
        
        // Sort bills by due date
        bills.sort((a, b) => a.dueDate.compareTo(b.dueDate));
      } else {
        errorMessage.value = result['message'] ?? 'Failed to load invoice';
        bills.clear();
        Get.snackbar(
          'Error',
          errorMessage.value,
          backgroundColor: Colors.red.shade100,
          colorText: Colors.red.shade900,
          duration: const Duration(seconds: 3),
        );
      }
    } catch (e) {
      errorMessage.value = 'Error: ${e.toString()}';
      bills.clear();
      Get.snackbar(
        'Error',
        'Failed to connect to server: ${e.toString()}',
        backgroundColor: Colors.red.shade100,
        colorText: Colors.red.shade900,
        duration: const Duration(seconds: 3),
      );
      print('Error detail: $e');
    } finally {
      isLoading.value = false;
      
      checkOverdueBills();
    }
  }

  void checkOverdueBills() {
    for (var bill in bills) {
      if (bill.isOverdue) {
        showOverdueNotification(bill);
      }
    }
  }

  void checkBillNotifications() {
    for (var bill in bills) {
      // Check for overdue bills
      if (bill.isOverdue) {
        showOverdueNotification(bill);
      }

      // Check for bills due tomorrow using the isDueTomorrow getter
      if (bill.isDueTomorrow) {
        showDueTomorrowNotification(bill);
      }
    }
  }

  void showDueTomorrowNotification(Bill bill) {
    final currencyFormat = NumberFormat.currency(
      locale: 'id',
      symbol: 'Rp ',
      decimalDigits: 0,
    );

    Get.snackbar(
      'Bill Due Tomorrow',
      'Your bill for "${bill.name}" (${currencyFormat.format(bill.amount)}) is due tomorrow!',
      backgroundColor: Colors.amber.shade100,
      colorText: Colors.amber.shade900,
      duration: const Duration(seconds: 5),
      snackPosition: SnackPosition.BOTTOM,
      isDismissible: true,
      dismissDirection: DismissDirection.horizontal,
      icon: const Icon(Icons.access_time, color: Colors.amber),
      mainButton: TextButton(
        onPressed: () {
          // Close the notification
          Get.back();
        },
        child: const Text('Tutup', style: TextStyle(color: Colors.amber)),
      ),
    );
  }

  void showOverdueNotification(Bill bill) {
    Get.snackbar(
      'Bill has been Ovedue',
      'Your bill for "${bill.name}" was due ${bill.daysOverdue} days ago!',
      backgroundColor: Colors.red.shade100,
      colorText: Colors.red.shade900,
      duration: const Duration(seconds: 5),
      snackPosition: SnackPosition.BOTTOM,
      isDismissible: true,
      dismissDirection: DismissDirection.horizontal,
      icon: const Icon(Icons.warning, color: Colors.red),
    );
  }

  Future<void> addBill(String name, double amount, DateTime dueDate, String category) async {
    isLoading.value = true;
    errorMessage.value = '';
    
    try {
      final formattedDate = DateFormat('yyyy-MM-dd').format(dueDate);
      final result = await ApiService.createBill(
        name,
        amount,
        formattedDate,
        category,
      );
      
      if (result['success']) {
        // Refresh bills list after adding
        await fetchBills();
        Get.snackbar(
          'Sukses',
          'Bill added successfully',
          backgroundColor: Colors.green.shade100,
          colorText: Colors.green.shade900,
        );
        return;
      } else {
        errorMessage.value = result['message'] ?? 'Failed to add bill';
        Get.snackbar(
          'Error',
          errorMessage.value,
          backgroundColor: Colors.red.shade100,
          colorText: Colors.red.shade900,
        );
      }
    } catch (e) {
      errorMessage.value = 'Error: ${e.toString()}';
      Get.snackbar(
        'Error',
        'Failed to connect to server: ${e.toString()}',
        backgroundColor: Colors.red.shade100,
        colorText: Colors.red.shade900,
      );
    } finally {
      isLoading.value = false;
    }
  }

  String getCategoryIcon(String category) {
    switch (category.toLowerCase()) {
      case 'rent':
        return 'home';
      case 'utilities':
        return 'bolt';
      case 'insurance':
        return 'favorite';
      case 'vehicle':
        return 'local_shipping';
      case 'heart':
        return 'favorite';
      case 'electricity':
        return 'bolt';
      default:
        return 'receipt';
    }
  }

  Future<void> deleteBill(int id) async {
    isLoading.value = true;
    errorMessage.value = '';
    
    try {
      final result = await ApiService.deleteBill(id);
      
      if (result['success']) {
        bills.removeWhere((bill) => bill.id == id);
        Get.snackbar(
          'Success',
          'Bill has been paid successfully',
          backgroundColor: Colors.green.shade100,
          colorText: Colors.green.shade900,
        );
      } else {
        errorMessage.value = result['message'] ?? 'Failed to delete bill';
        Get.snackbar(
          'Error',
          errorMessage.value,
          backgroundColor: Colors.red.shade100,
          colorText: Colors.red.shade900,
        );
      }
    } catch (e) {
      errorMessage.value = 'Error: ${e.toString()}';
      Get.snackbar(
        'Error',
        'Failed to connect to server: ${e.toString()}',
        backgroundColor: Colors.red.shade100,
        colorText: Colors.red.shade900,
      );
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> editBill(int id, String name, double amount, DateTime dueDate, String category) async {
    isLoading.value = true;
    errorMessage.value = '';
    
    try {
      final formattedDate = DateFormat('yyyy-MM-dd').format(dueDate);
      final result = await ApiService.updateBill(
        id,
        name,
        amount,
        formattedDate,
        category,
      );
      
      if (result['success']) {
        // Refresh bills list after updating
        await fetchBills();
        Get.snackbar(
          'Success',
          'Bill updated successfully',
          backgroundColor: Colors.green.shade100,
          colorText: Colors.green.shade900,
        );
      } else {
        errorMessage.value = result['message'] ?? 'Failed to update bill';
        Get.snackbar(
          'Error',
          errorMessage.value,
          backgroundColor: Colors.red.shade100,
          colorText: Colors.red.shade900,
        );
      }
    } catch (e) {
      errorMessage.value = 'Error: ${e.toString()}';
      Get.snackbar(
        'Error',
        'Failed to connect to server: ${e.toString()}',
        backgroundColor: Colors.red.shade100,
        colorText: Colors.red.shade900,
      );
    } finally {
      isLoading.value = false;
    }
  }

  // Perbarui metode populateFormForEdit untuk juga mengupdate icon
  void populateFormForEdit(Bill bill) {
    nameController.text = bill.name;
    amountController.text = bill.amount.toString();
    selectedDate.value = bill.dueDate;
    dateController.text = DateFormat('yyyy-MM-dd').format(bill.dueDate);
    selectedCategory.value = bill.category;
    updateSelectedIcon(bill.category);
  }
  
  // Perbarui metode clearForm untuk juga mereset icon
  void clearForm() {
    nameController.clear();
    amountController.clear();
    dateController.clear();
    selectedDate.value = null;
    selectedCategory.value = categories.first;
    updateSelectedIcon(categories.first);
  }
  
  // Metode untuk mendapatkan icon berdasarkan kategori
  IconData getIconForCategory(String category) {
    return categoryIcons[category] ?? Icons.receipt;
  }

  // Metode untuk mengatur tanggal terpilih
  void setSelectedDate(DateTime date) {
    selectedDate.value = date;
    dateController.text = DateFormat('yyyy-MM-dd').format(date);
  }

  Future<void> submitForm() async {
    if (nameController.text.isEmpty ||
        amountController.text.isEmpty ||
        selectedDate.value == null) {
      Get.snackbar(
        'Error',
        'Please fill in all fields',
        backgroundColor: Colors.red.shade100,
        colorText: Colors.red.shade900,
      );
      return;
    }
    
    try {
      final amount = double.parse(amountController.text);
      
      await addBill(
        nameController.text,
        amount,
        selectedDate.value!,
        selectedCategory.value,
      );

      clearForm();
    } catch (e) {
      Get.snackbar(
        'Error',
        'Failed to add bill: ${e.toString()}',
        backgroundColor: Colors.red.shade100,
        colorText: Colors.red.shade900,
      );
    }
  }
}
