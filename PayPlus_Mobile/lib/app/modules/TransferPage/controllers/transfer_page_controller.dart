import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:payplus_mobile/services/api_service.dart';

class TransferPageController extends GetxController {
  final searchController = TextEditingController();
  final amountController = TextEditingController();
  final notesController = TextEditingController();
  
  final RxString selectedUser = ''.obs;
  final RxString selectedUserPhone = ''.obs;
  final RxString transferType = 'Normal'.obs;
  final RxBool isLoading = false.obs;
  final RxList<Map<String, dynamic>> searchResults = <Map<String, dynamic>>[].obs;
  final RxList<Map<String, dynamic>> friends = <Map<String, dynamic>>[].obs;
  final RxInt transferMethod = 0.obs; 
  final RxString currentUserPhone = ''.obs; 
  final List<String> transferTypes = ['Normal', 'Gift'];
  
  @override
  void onInit() {
    super.onInit();
    fetchFriends();
    getCurrentUserProfile();
  }
  
  // Fungsi untuk mengambil profil pengguna saat ini
  Future<void> getCurrentUserProfile() async {
    try {
      final result = await ApiService.getProfile();
      if (result['success'] && result['data'] != null) {
        currentUserPhone.value = result['data']['phone']?.toString() ?? '';
      }
    } catch (e) {
      print('Error mengambil profil pengguna: ${e.toString()}');
    }
  }
  
  // Fungsi untuk mengambil daftar teman dari API
  Future<void> fetchFriends() async {
    isLoading.value = true;
    try {
      final result = await ApiService.getFriends();
      if (result['success']) {
        if (result['data'] != null && result['data']['friends'] != null) {
          friends.value = List<Map<String, dynamic>>.from(result['data']['friends']);
        } else {
          friends.clear();
        }
      } else {
        Get.snackbar(
          'Error', 
          result['message'] ?? 'Failed to load friends list',
          backgroundColor: Colors.red.withOpacity(0.7),
          colorText: Colors.white
        );
      }
    } catch (e) {
      Get.snackbar(
        'Error', 
        'An error occurred: ${e.toString()}',
        backgroundColor: Colors.red.withOpacity(0.7),
        colorText: Colors.white
      );
    } finally {
      isLoading.value = false;
    }
  }
  
  // Fungsi untuk memilih teman dari daftar
  void selectFriend(Map<String, dynamic> friend) {
    if (friend['phone'].toString() == currentUserPhone.value) {
      Get.snackbar(
        'Error', 
        'You cannot transfer to yourself',
        backgroundColor: Colors.red.withOpacity(0.7),
        colorText: Colors.white
      );
      return;
    }
    
    selectedUser.value = 'User: ${friend['name']}';
    selectedUserPhone.value = friend['phone'].toString();
    
    Get.snackbar(
      'Success', 
      'User selected: ${friend['name']}',
      backgroundColor: Colors.green.withOpacity(0.7),
      colorText: Colors.white
    );
  }
  
  Future<void> searchUser() async {
    if (searchController.text.isEmpty) {
      Get.snackbar(
        'Error', 
        'Please enter a name or phone number',
        backgroundColor: Colors.red.withOpacity(0.7),
        colorText: Colors.white
      );
      return;
    }
    
    isLoading.value = true;
    try {
      final result = await ApiService.searchUser(searchController.text);
      if (result['success']) {
        if (result['data'] != null) { 
          try {
            if (result['data']['name'] != null) {
              if (result['data']['phone'].toString() == currentUserPhone.value) {
                Get.snackbar(
                  'Error', 
                  'You cannot transfer to yourself',
                  backgroundColor: Colors.red.withOpacity(0.7),
                  colorText: Colors.white
                );
                return;
              }
              
              selectedUser.value = 'User: ${result['data']['name']}';
              selectedUserPhone.value = result['data']['phone'].toString();
              
              Get.snackbar(
                'Success', 
                'User found!',
                backgroundColor: Colors.green.withOpacity(0.7),
                colorText: Colors.white
              );
            } else {
              Get.snackbar(
                'Info', 
                'No user found',
                backgroundColor: Colors.orange.withOpacity(0.7),
                colorText: Colors.white
              );
            }
          } catch (e) {
            Get.snackbar(
              'Error', 
              'Invalid data format: ${e.toString()}',
              backgroundColor: Colors.red.withOpacity(0.7),
              colorText: Colors.white
            );
          }
        } else {
          Get.snackbar(
            'Info', 
            'No data found',
            backgroundColor: Colors.orange.withOpacity(0.7),
            colorText: Colors.white
          );
        }
      } else {
        Get.snackbar(
          'Error', 
          result['message'] ?? 'Failed to search user',
          backgroundColor: Colors.red.withOpacity(0.7),
          colorText: Colors.white
        );
      }
    } catch (e) {
      Get.snackbar(
        'Error', 
        'An error occurred: ${e.toString()}',
        backgroundColor: Colors.red.withOpacity(0.7),
        colorText: Colors.white
      );
    } finally {
      isLoading.value = false;
    }
  }
  
  Future<void> sendTransfer() async {
    if (selectedUserPhone.value.isEmpty) {
      Get.snackbar(
        'Error', 
        'Please search and select a recipient',
        backgroundColor: Colors.red.withOpacity(0.7),
        colorText: Colors.white
      );
      return;
    }
    
    if (selectedUserPhone.value == currentUserPhone.value) {
      Get.snackbar(
        'Error', 
        'You cannot transfer to yourself',
        backgroundColor: Colors.red.withOpacity(0.7),
        colorText: Colors.white
      );
      return;
    }
    
    if (amountController.text.isEmpty) {
      Get.snackbar(
        'Error', 
        'Please enter an amount',
        backgroundColor: Colors.red.withOpacity(0.7),
        colorText: Colors.white
      );
      return;
    }
    
    int amount;
    try {
      amount = int.parse(amountController.text);
    } catch (e) {
      Get.snackbar(
        'Error', 
        'Amount must be a number',
        backgroundColor: Colors.red.withOpacity(0.7),
        colorText: Colors.white
      );
      return;
    }
    
    isLoading.value = true;
    try {
      final result = await ApiService.transferMoney(
        selectedUserPhone.value,
        amount,
        transferType.value,
        transferType.value == 'Gift' ? notesController.text : null
      );
      
      if (result['success']) {
        Get.snackbar(
          'Success', 
          'Transfer of ${amountController.text} successfully sent to ${selectedUser.value}',
          backgroundColor: Colors.green.withOpacity(0.7),
          colorText: Colors.white
        );
        
        searchController.clear();
        amountController.clear();
        notesController.clear();
        selectedUser.value = '';
        selectedUserPhone.value = '';
        searchResults.clear();
      } else {
        Get.snackbar(
          'Error', 
          result['message'] ?? 'Failed to make transfer',
          backgroundColor: Colors.red.withOpacity(0.7),
          colorText: Colors.white
        );
      }
    } catch (e) {
      Get.snackbar(
        'Error', 
        'An error occurred: ${e.toString()}',
        backgroundColor: Colors.red.withOpacity(0.7),
        colorText: Colors.white
      );
    } finally {
      isLoading.value = false;
    }
  }
  
  @override
  void onClose() {
    searchController.dispose();
    amountController.dispose();
    notesController.dispose();
    super.onClose();
  }
}