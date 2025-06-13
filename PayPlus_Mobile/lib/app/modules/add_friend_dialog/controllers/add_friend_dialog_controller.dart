import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:payplus_mobile/services/api_service.dart';

class AddFriendDialogController extends GetxController {
  final phoneController = TextEditingController();
  final isLoading = false.obs;
  final errorMessage = ''.obs;

  @override
  void onClose() {
    phoneController.dispose();
    super.onClose();
  }

  Future<bool> addFriend() async {
    try {
      isLoading.value = true;
      errorMessage.value = '';

      if (phoneController.text.isEmpty) {
        errorMessage.value = 'Nomor telepon tidak boleh kosong';
        return false;
      }

      final result = await ApiService.addFriend(phoneController.text);

      if (result['success']) {
        return true;
      } else {
        errorMessage.value = result['message'] ?? 'Gagal menambahkan teman';
        return false;
      }
    } catch (e) {
      errorMessage.value = 'Terjadi kesalahan: ${e.toString()}';
      return false;
    } finally {
      isLoading.value = false;
    }
  }
}
