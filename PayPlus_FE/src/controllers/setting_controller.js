import Setting from '../models/setting_model';
import { ApiService } from '../services/apiService.js';

class SettingController {
  // Mengambil data profil pengguna
  static async getProfile() {
    try {
      const response = await ApiService.getProfile();
      if (response.success && response.data) {
        return {
          success: true,
          data: Setting.fromJson(response.data)
        };
      } else {
        return {
          success: false,
          message: response.message || 'Gagal memuat data profil'
        };
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      return {
        success: false,
        message: 'Terjadi kesalahan saat memuat profil'
      };
    }
  }

  // Memperbarui profil pengguna
  static async updateProfile(name, email) {
    try {
      const response = await ApiService.updateProfile(name, email);
      return response;
    } catch (error) {
      console.error('Error updating profile:', error);
      return {
        success: false,
        message: 'Terjadi kesalahan saat memperbarui profil'
      };
    }
  }

  // Mengubah password pengguna
  static async changePassword(oldPassword, newPassword) {
    try {
      const response = await ApiService.changePassword(oldPassword, newPassword);
      return response;
    } catch (error) {
      console.error('Error changing password:', error);
      return {
        success: false,
        message: 'Terjadi kesalahan saat mengubah password'
      };
    }
  }

  // Validasi email
  static isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  // Validasi form
  static validateForm(fullName, email, currentPassword, newPassword, confirmPassword) {
    if (!fullName.trim()) {
      return {
        isValid: false,
        message: 'Silakan masukkan nama Anda'
      };
    }

    if (!email.trim()) {
      return {
        isValid: false,
        message: 'Silakan masukkan email Anda'
      };
    }

    if (!this.isValidEmail(email)) {
      return {
        isValid: false,
        message: 'Silakan masukkan email yang valid'
      };
    }

    if (newPassword && !currentPassword) {
      return {
        isValid: false,
        message: 'Silakan masukkan password saat ini'
      };
    }

    if (newPassword && newPassword.length < 6) {
      return {
        isValid: false,
        message: 'Password harus minimal 6 karakter'
      };
    }

    if (newPassword && newPassword !== confirmPassword) {
      return {
        isValid: false,
        message: 'Password tidak cocok'
      };
    }

    return {
      isValid: true
    };
  }
}

export default SettingController;