import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:payplus_mobile/services/api_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LoginPageController extends GetxController {
  final phoneController = TextEditingController();
  final passwordController = TextEditingController();

  final isPasswordHidden = true.obs;
  final rememberMe = false.obs;
  final isLoading = false.obs;

  @override
  void onInit() {
    super.onInit();
    loadSavedCredentials();
  }

  @override
  void onClose() {
    phoneController.dispose();
    passwordController.dispose();
    super.onClose();
  }

  void togglePasswordVisibility() {
    isPasswordHidden.value = !isPasswordHidden.value;
  }

  void toggleRememberMe() {
    rememberMe.value = !rememberMe.value;
  }

  // Fungsi untuk menyimpan kredensial
  Future<void> saveCredentials() async {
    final prefs = await SharedPreferences.getInstance();
    if (rememberMe.value) {
      await prefs.setString('phone', phoneController.text);
      await prefs.setString('password', passwordController.text);
      await prefs.setBool('rememberMe', true);
    } else {
      await prefs.remove('phone');
      await prefs.remove('password');
      await prefs.setBool('rememberMe', false);
    }
  }

  // Fungsi untuk memuat kredensial tersimpan
  Future<void> loadSavedCredentials() async {
    final prefs = await SharedPreferences.getInstance();
    final savedRememberMe = prefs.getBool('rememberMe') ?? false;
    
    if (savedRememberMe) {
      final savedPhone = prefs.getString('phone') ?? '';
      final savedPassword = prefs.getString('password') ?? '';
      
      phoneController.text = savedPhone;
      passwordController.text = savedPassword;
      rememberMe.value = true;
    }
  }

  Future<void> login() async {
    if (phoneController.text.isEmpty) {
      Get.snackbar(
        'Error', 
        'Please enter your phone number',
        backgroundColor: Colors.red.withOpacity(0.7),
        colorText: Colors.white,
      );
      return;
    }

    if (passwordController.text.isEmpty) {
      Get.snackbar(
        'Error', 
        'Please enter your password',
        backgroundColor: Colors.red.withOpacity(0.7),
        colorText: Colors.white,
      );
      return;
    }

    try {
      isLoading.value = true;
      
      final result = await ApiService.login(
        phoneController.text, 
        passwordController.text
      );
      
      if (result['success']) {
        // Simpan kredensial jika "Remember Me" diaktifkan
        await saveCredentials();
        
        Get.snackbar(
          'Success', 
          'Login successful',
          backgroundColor: Colors.green.withOpacity(0.7),
          colorText: Colors.white,
        );
        
        Get.offAllNamed('/home');
      } else {
        Get.snackbar(
          'Error', 
          result['message'] ?? 'Login failed',
          backgroundColor: Colors.red.withOpacity(0.7),
          colorText: Colors.white,
        );
      }
    } catch (e) {
      Get.snackbar(
        'Error', 
        'Login failed: ${e.toString()}',
        backgroundColor: Colors.red.withOpacity(0.7),
        colorText: Colors.white,
      );
    } finally {
      isLoading.value = false;
    }
  }

  void goToSignUp() {
    Get.toNamed('/signup');
  }
}
