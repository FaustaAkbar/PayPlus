import 'package:get/get.dart';
import 'package:payplus_mobile/services/api_service.dart';

class TopUpAmountController extends GetxController {
  final isLoading = false.obs;
  final errorMessage = ''.obs;

  // Fungsi untuk melakukan top up
  Future<Map<String, dynamic>> topUp(String amount) async {
    isLoading.value = true;
    errorMessage.value = '';
    
    try {
      // Panggil API untuk top up
      final result = await ApiService.topUp(amount);
      isLoading.value = false;
      return result;
    } catch (e) {
      isLoading.value = false;
      errorMessage.value = e.toString();
      return {'success': false, 'message': e.toString()};
    }
  }
}