import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:payplus_mobile/app/models/savings_model.dart';
import 'package:payplus_mobile/services/api_service.dart';

class Saving {
  final String title;
  final String description;
  final int target;
  final int collected;

  Saving({
    required this.title,
    required this.description,
    required this.target,
    required this.collected,
  });
}

class SavingsController extends GetxController {
  final titleController = TextEditingController();
  final descriptionController = TextEditingController();
  final targetController = TextEditingController();
  final collectedController = TextEditingController();

  final savingsList = <Savings>[].obs;
  final isLoading = false.obs;
  final errorMessage = ''.obs;

  int get totalTarget => savingsList.fold<int>(0, (sum, saving) => sum + saving.target);
  int get totalCollected => savingsList.fold<int>(0, (sum, saving) => sum + saving.collected);

  @override
  void onInit() {
    super.onInit();
    fetchSavings();
  }

  // Tambahkan controller untuk edit target
  final editTargetController = TextEditingController();

  @override
  void onClose() {
    titleController.dispose();
    descriptionController.dispose();
    targetController.dispose();
    collectedController.dispose();
    editTargetController.dispose();
    super.onClose();
  }

  Future<void> fetchSavings() async {
    isLoading.value = true;
    errorMessage.value = '';
    
    try {
      final result = await ApiService.getSavings();
      
      if (result['success']) {
        final dynamic savingsData = result['data'];
        
        if (savingsData is List) {
          // Jika data adalah List, proses seperti biasa
          savingsList.value = savingsData.map((data) => Savings.fromJson(data)).toList();
        } else if (savingsData is Map) {
          // Jika data adalah Map dengan format {summary: {...}, records: [...]}
          if (savingsData.containsKey('records') && savingsData['records'] is List) {
            savingsList.value = (savingsData['records'] as List).map((data) => Savings.fromJson(data)).toList();
          } else if (savingsData.containsKey('savings') && savingsData['savings'] is List) {
            savingsList.value = (savingsData['savings'] as List).map((data) => Savings.fromJson(data)).toList();
          } else {
            // Jika tidak ada kunci yang berisi List, kosongkan savings
            savingsList.clear();
          }
        } else {
          // Jika data bukan List atau Map, kosongkan savings
          savingsList.clear();
        }
      } else {
        errorMessage.value = result['message'] ?? 'Failed to load savings data';
        savingsList.clear();
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
      savingsList.clear();
      Get.snackbar(
        'Error',
        'Failed to connect to the server: ${e.toString()}',
        backgroundColor: Colors.red.shade100,
        colorText: Colors.red.shade900,
        duration: const Duration(seconds: 3),
      );
    } finally {
      isLoading.value = false;
    }
  }

  void clearInputFields() {
    titleController.clear();
    descriptionController.clear();
    targetController.clear();
    collectedController.clear();
  }

  Future<void> addNewSaving() async {
    final title = titleController.text;
    final description = descriptionController.text;
    final target = int.tryParse(targetController.text) ?? 0;
    final collected = int.tryParse(collectedController.text) ?? 0;

    if (title.isEmpty) {
      Get.snackbar(
        'Error',
        'Savings title cannot be empty',
        backgroundColor: Colors.red.shade100,
        colorText: Colors.red.shade900,
      );
      return;
    }

    if (target <= 0) {
      Get.snackbar(
        'Error',
        'Savings target must be more than 0',
        backgroundColor: Colors.red.shade100,
        colorText: Colors.red.shade900,
      );
      return;
    }

    isLoading.value = true;
    errorMessage.value = '';
    
    try {
      final result = await ApiService.createSaving(
        title,
        description,
        target,
        collected,
      );
      
      if (result['success']) {
        // Refresh savings list after adding
        await fetchSavings();
        Get.snackbar(
          'Success',
          'New savings created successfully',
          backgroundColor: Colors.green.shade100,
          colorText: Colors.green.shade900,
        );
      } else {
        errorMessage.value = result['message'] ?? 'Failed to create new savings';
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
        'Failed to connect to the server: ${e.toString()}',
        backgroundColor: Colors.red.shade100,
        colorText: Colors.red.shade900,
      );
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> addToSaving(int index, int amount) async {
    if (index < 0 || index >= savingsList.length || amount <= 0) {
      Get.snackbar(
        'Error',
        'Invalid data',
        backgroundColor: Colors.red.shade100,
        colorText: Colors.red.shade900,
      );
      return;
    }

    final saving = savingsList[index];
    if (saving.id == null) {
      Get.snackbar(
        'Error',
        'Invalid savings ID',
        backgroundColor: Colors.red.shade100,
        colorText: Colors.red.shade900,
      );
      return;
    }
    
    try {
      isLoading.value = true;
      
      final result = await ApiService.addToSaving(saving.id!, amount);
      
      if (result['success']) {
        // Refresh savings list after adding
        await fetchSavings();
        Get.snackbar(
          'Success',
          'Funds are successfully added to savings',
          backgroundColor: Colors.green.shade100,
          colorText: Colors.green.shade900,
        );
      } else {
        errorMessage.value = result['message'] ?? 'Failed to add funds to savings';
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
        'Failed to connect to the server: ${e.toString()}',
        backgroundColor: Colors.red.shade100,
        colorText: Colors.red.shade900,
      );
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> withdrawSaving(int index) async {
    if (index < 0 || index >= savingsList.length) {
      return;
    }

    final saving = savingsList[index];
    if (saving.id == null) {
      Get.snackbar(
        'Error',
        'Invalid savings ID',
        backgroundColor: Colors.red.shade100,
        colorText: Colors.red.shade900,
      );
      return;
    }

    isLoading.value = true;
    errorMessage.value = '';
    
    try {
      final result = await ApiService.withdrawSaving(saving.id!);
      
      if (result['success']) {
        // Refresh savings list after withdrawing
        await fetchSavings();
        Get.snackbar(
          'Success',
          'Savings funds are successfully withdrawn to the main balance',
          backgroundColor: Colors.green.shade100,
          colorText: Colors.green.shade900,
        );
      } else {
        errorMessage.value = result['message'] ?? 'Failure to withdraw savings funds';
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
        'Failed to connect to the server: ${e.toString()}',
        backgroundColor: Colors.red.shade100,
        colorText: Colors.red.shade900,
      );
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> deleteSaving(int index) async {
    if (index < 0 || index >= savingsList.length) {
      return;
    }

    final saving = savingsList[index];
    if (saving.id == null) {
      Get.snackbar(
        'Error',
        'Invalid savings ID',
        backgroundColor: Colors.red.shade100,
        colorText: Colors.red.shade900,
      );
      return;
    }

    isLoading.value = true;
    errorMessage.value = '';
    
    try {
      final result = await ApiService.deleteSaving(saving.id!);
      
      if (result['success']) {
        // Refresh savings list after deleting
        await fetchSavings();
        Get.snackbar(
          'Success',
          'Savings successfully deleted',
          backgroundColor: Colors.green.shade100,
          colorText: Colors.green.shade900,
        );
      } else {
        errorMessage.value = result['message'] ?? 'Failed to delete savings';
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
        'Failed to connect to the server: ${e.toString()}',
        backgroundColor: Colors.red.shade100,
        colorText: Colors.red.shade900,
      );
    } finally {
      isLoading.value = false;
    }
  }

  String formatCurrency(int amount) {
    return 'Rp ${amount.toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]}.')}';
  }

  Future<void> updateSavingTarget(int index, int newTarget) async {
    if (index < 0 || index >= savingsList.length || newTarget <= 0) {
      Get.snackbar(
        'Error',
        'Invalid data',
        backgroundColor: Colors.red.shade100,
        colorText: Colors.red.shade900,
      );
      return;
    }

    final saving = savingsList[index];
    if (saving.id == null) {
      Get.snackbar(
        'Error',
        'Invalid savings ID',
        backgroundColor: Colors.red.shade100,
        colorText: Colors.red.shade900,
      );
      return;
    }

    isLoading.value = true;
    errorMessage.value = '';
    
    try {
      final result = await ApiService.updateSavingTarget(
        saving.id!,
        newTarget,
      );
      
      if (result['success']) {
        // Refresh savings list after updating
        await fetchSavings();
        Get.snackbar(
          'Success',
          'Savings target updated successfully',
          backgroundColor: Colors.green.shade100,
          colorText: Colors.green.shade900,
        );
      } else {
        errorMessage.value = result['message'] ?? 'Failed to update savings target';
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
        'Failed to connect to the server: ${e.toString()}',
        backgroundColor: Colors.red.shade100,
        colorText: Colors.red.shade900,
      );
    } finally {
      isLoading.value = false;
    }
  }
}