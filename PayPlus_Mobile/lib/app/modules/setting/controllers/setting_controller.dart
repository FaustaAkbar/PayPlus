import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:payplus_mobile/app/routes/app_pages.dart';
import 'package:payplus_mobile/services/api_service.dart';
import 'package:payplus_mobile/services/settings_service.dart';
import 'dart:io';
import 'package:image_picker/image_picker.dart';

class SettingController extends GetxController {
  final formKey = GlobalKey<FormState>();

  final fullNameController = TextEditingController();
  final emailController = TextEditingController();
  final currentPasswordController = TextEditingController();
  final newPasswordController = TextEditingController();
  final confirmPasswordController = TextEditingController();

  var isLoading = false.obs;
  var isCurrentPasswordVisible = false.obs;
  var isNewPasswordVisible = false.obs;
  var isConfirmPasswordVisible = false.obs;
  var errorMessage = ''.obs;
  var isError = false.obs;
  var phoneNumber = ''.obs;
  final Rx<File?> profileImage = Rx<File?>(null); //
  final ImagePicker _picker = ImagePicker();

  @override
  void onInit() {
    super.onInit();
    loadUserProfile();
  }

  @override
  void onClose() {
    fullNameController.dispose();
    emailController.dispose();
    currentPasswordController.dispose();
    newPasswordController.dispose();
    confirmPasswordController.dispose();
    super.onClose();
  }

  //## Untuk mengambil data profile user
  Future<void> loadUserProfile() async {
    isLoading.value = true;
    try {
      final result = await ApiService.getProfile();
      if (result['success']) {
        final data = result['data'];
        fullNameController.text = data['name'];
        emailController.text = data['email'];
        phoneNumber.value = data['phone'].toString();
      } else {
        setErrorMessage(result['message'] ?? 'Failed to load profile');
      }
    } catch (e) {
      setErrorMessage('Error loading profile: ${e.toString()}');
    } finally {
      isLoading.value = false;
    }
  }

  //## Fungsi untuk menampilkan/menyembunyikan tampilan isi password
  void toggleCurrentPasswordVisibility() {
    isCurrentPasswordVisible.value = !isCurrentPasswordVisible.value;
  }

  void toggleNewPasswordVisibility() {
    isNewPasswordVisible.value = !isNewPasswordVisible.value;
  }

  void toggleConfirmPasswordVisibility() {
    isConfirmPasswordVisible.value = !isConfirmPasswordVisible.value;
  }

  //## Fungsi untuk menghapus pesan error
  void clearMessage() {
    errorMessage.value = '';
  }

  //## Fungsi untuk set pesan error
  void setErrorMessage(String message) {
    errorMessage.value = message;
    isError.value = true;
  }

  //## Fungsi untuk set pesan sukses
  void setSuccessMessage(String message) {
    errorMessage.value = message;
    isError.value = false;
  }

  //## Fungsi untuk mengupdate data profile jika klik tombol save
  Future<void> saveChanges() async {
    if (formKey.currentState!.validate()) {
      isLoading.value = true;
      clearMessage();
      try {
        final bool isChangingPassword =
            currentPasswordController.text.isNotEmpty &&
                newPasswordController.text.isNotEmpty &&
                confirmPasswordController.text.isNotEmpty;
        if (isChangingPassword) {
          if (newPasswordController.text != confirmPasswordController.text) {
            setErrorMessage('New passwords do not match');
            isLoading.value = false;
            return;
          }
        }
        final result = await SettingsService.updateSettings(
            name: fullNameController.text,
            email: emailController.text,
            currentPassword:
                isChangingPassword ? currentPasswordController.text : null,
            newPassword:
                isChangingPassword ? newPasswordController.text : null);
        if (result['success']) {
          if (isChangingPassword) {
            currentPasswordController.clear();
            newPasswordController.clear();
            confirmPasswordController.clear();
          }
          setSuccessMessage(
              result['message'] ?? 'Profile updated successfully');
        } else {
          setErrorMessage(result['message'] ?? 'Failed to update profile');
        }
      } catch (e) {
        setErrorMessage('Error: ${e.toString()}');
      } finally {
        isLoading.value = false;
      }
    }
  }

  //## Fungsi untuk logout
  Future<void> logout() async {
    isLoading.value = true;
    clearMessage();
    try {
      final result = await ApiService.logout();
      if (result['success']) {
        Get.snackbar(
          'Berhasil',
          result['message'],
          backgroundColor: Colors.green.withOpacity(0.7),
          colorText: Colors.white,
        );
        Get.offAllNamed(Routes.LOGIN);
      } else {
        setErrorMessage(result['message'] ?? 'Logout gagal');
      }
    } catch (e) {
      setErrorMessage('Error: ${e.toString()}');
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> pickProfileImage() async {
    final XFile? pickedFile = await _picker.pickImage(
      source: await _showImageSourceDialog(),
      imageQuality: 80,
      maxWidth: 600,
    );
    if (pickedFile != null) {
      profileImage.value = File(pickedFile.path);
    }
  }

  Future<ImageSource> _showImageSourceDialog() async {
    ImageSource? source = ImageSource.gallery;
    await Get.dialog(
      AlertDialog(
        title: const Text('Pilih Sumber Foto'),
        content: const Text('Ambil foto dari kamera atau galeri?'),
        actions: [
          TextButton(
            onPressed: () {
              source = ImageSource.camera;
              Get.back();
            },
            child: const Text('Kamera'),
          ),
          TextButton(
            onPressed: () {
              source = ImageSource.gallery;
              Get.back();
            },
            child: const Text('Galeri'),
          ),
        ],
      ),
    );
    return source!;
  }
}
