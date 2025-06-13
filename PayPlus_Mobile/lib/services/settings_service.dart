import 'package:payplus_mobile/services/api_service.dart';

class SettingsService {
  //## UPDATE PROFILE DAN PASSWORD SEMUA
  static Future<Map<String, dynamic>> updateSettings(
      {required String name,
      required String email,
      String? currentPassword,
      String? newPassword}) async {
    try {
      final profileResult = await ApiService.updateProfile(name, email);
      if (!profileResult['success']) {
        return profileResult;
      }
      if (currentPassword != null &&
          newPassword != null &&
          currentPassword.isNotEmpty &&
          newPassword.isNotEmpty) {
        final passwordResult =
            await ApiService.changePassword(currentPassword, newPassword);
        if (passwordResult['success']) {
          return {
            'success': true,
            'message': 'Profile and password updated successfully',
          };
        } else {
          return passwordResult;
        }
      }
      return {
        'success': true,
        'message': 'Profile updated successfully',
      };
    } catch (e) {
      return {
        'success': false,
        'message': 'Error updating settings: ${e.toString()}'
      };
    }
  }
}
