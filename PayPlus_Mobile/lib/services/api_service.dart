import 'dart:convert';
import 'dart:math' show min;
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  // Base URL for the backend API

  static const String baseUrl = 'https://78nvh33s-3000.asse.devtunnels.ms/api';
  // Token storage keyd
  static const String tokenKey = 'auth_token';

  // Headers for API requests
  static final Map<String, String> _headers = {
    'Content-Type': 'application/json',
  };

  // Method to set auth token in headers
  static Future<void> setAuthToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(tokenKey, token);
    _headers['Authorization'] = 'Bearer $token';
  }

  // Method to get auth token from storage
  static Future<String?> getAuthToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(tokenKey);
  }

  //## Metod untuk menghapus token otentikasi
  static Future<void> clearAuthToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(tokenKey);
    _headers.remove('Authorization');
  }

  // Initialize auth token from storage
  static Future<void> initializeAuth() async {
    final token = await getAuthToken();
    if (token != null && token.isNotEmpty) {
      _headers['Authorization'] = 'Bearer $token';
    }
  }

  // Ensure headers have auth token
  static Future<Map<String, String>> _getAuthHeaders() async {
    final token = await getAuthToken();
    if (token != null && token.isNotEmpty) {
      _headers['Authorization'] = 'Bearer $token';
    }
    return _headers;
  }

// Metode untuk mengirim pesan ke chatbot
  static Future<Map<String, dynamic>> sendChatbotMessage(String message) async {
    try {
      // Check if token exists
      final token = await getAuthToken();
      if (token == null || token.isEmpty) {
        return {'success': false, 'message': 'Authentication required'};
      }

      final headers = await _getAuthHeaders();

      final response = await http.post(
        Uri.parse('$baseUrl/chatbot'),
        headers: headers,
        body: jsonEncode({
          'message': message,
        }),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200) {
        return {
          'success': true,
          'response': data['response'],
        };
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Gagal mendapatkan respons dari chatbot'
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  // Login method
  static Future<Map<String, dynamic>> login(
      String phone, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: _headers,
        body: jsonEncode({
          'phone': phone,
          'password': password,
        }),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200) {
        if (data['token'] != null) {
          await setAuthToken(data['token']);
        }
        return {'success': true, 'data': data};
      } else {
        return {'success': false, 'message': data['message'] ?? 'Login failed'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  // Register method
  static Future<Map<String, dynamic>> register(
      String name, String phone, String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/register'),
        headers: _headers,
        body: jsonEncode({
          'name': name,
          'phone': phone,
          'email': email,
          'password': password,
        }),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 201 || response.statusCode == 200) {
        return {'success': true, 'data': data};
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Registration failed'
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  // Method to check if user is authenticated
  static Future<bool> isAuthenticated() async {
    final token = await getAuthToken();
    return token != null && token.isNotEmpty;
  }

  // Get friends list
  static Future<Map<String, dynamic>> getFriends() async {
    try {
      final token = await getAuthToken();
      if (token == null || token.isEmpty) {
        return {'success': false, 'message': 'Anda belum login'};
      }

      final headers = await _getAuthHeaders();

      final response = await http.get(
        Uri.parse('$baseUrl/friends'),
        headers: headers,
      );

      // Periksa jika respons bukan JSON
      if (response.headers['content-type'] != null &&
          !response.headers['content-type']!.contains('application/json')) {
        return {
          'success': false,
          'message':
              'Server mengembalikan format yang tidak valid: ${response.headers['content-type']}'
        };
      }

      Map<String, dynamic> data;
      try {
        data = jsonDecode(response.body);
      } catch (e) {
        return {
          'success': false,
          'message':
              'Format respons tidak valid: ${e.toString()}\nResponse: ${response.body.substring(0, min(100, response.body.length))}...'
        };
      }

      if (response.statusCode == 200) {
        return {'success': true, 'data': data};
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Gagal memuat daftar teman'
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  // Add friend by phone number
  static Future<Map<String, dynamic>> addFriend(String friendPhone) async {
    try {
      final token = await getAuthToken();
      if (token == null || token.isEmpty) {
        return {'success': false, 'message': 'Authentication required'};
      }

      final headers = await _getAuthHeaders();

      final response = await http.post(
        Uri.parse('$baseUrl/friends'),
        headers: headers,
        body: jsonEncode({
          'friendPhone': friendPhone,
        }),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 201 || response.statusCode == 200) {
        return {
          'success': true,
          'message': data['message'] ?? 'Teman berhasil ditambahkan'
        };
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Gagal menambahkan teman'
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  // Get friend requests
  static Future<Map<String, dynamic>> getFriendRequests() async {
    try {
      final token = await getAuthToken();
      if (token == null || token.isEmpty) {
        return {'success': false, 'message': 'Authentication required'};
      }

      final headers = await _getAuthHeaders();

      final response = await http.get(
        Uri.parse('$baseUrl/friends/requests'),
        headers: headers,
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200) {
        return {'success': true, 'data': data};
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Gagal memuat permintaan pertemanan'
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  // Respond to friend request (accept/reject)
  static Future<Map<String, dynamic>> respondToFriendRequest(
      String requestId, String action) async {
    try {
      final token = await getAuthToken();
      if (token == null || token.isEmpty) {
        return {'success': false, 'message': 'Authentication required'};
      }

      final headers = await _getAuthHeaders();

      final response = await http.patch(
        Uri.parse('$baseUrl/friends/respond/$requestId'),
        headers: headers,
        body: jsonEncode({
          'action': action,
        }),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200) {
        return {
          'success': true,
          'message':
              data['message'] ?? 'Permintaan pertemanan berhasil diproses'
        };
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Gagal memproses permintaan pertemanan'
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  // Endpoint baru: Hapus teman
  static Future<Map<String, dynamic>> deleteFriend(String friendId) async {
    try {
      final token = await getAuthToken();
      final response = await http.delete(
        Uri.parse('$baseUrl/friends/$friendId'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      final data = json.decode(response.body);
      return data;
    } catch (e) {
      return {
        'success': false,
        'message': 'Terjadi kesalahan: $e',
      };
    }
  }

  // Search user by phone
  static Future<Map<String, dynamic>> searchUser(String phone) async {
    try {
      final token = await getAuthToken();
      if (token == null || token.isEmpty) {
        return {'success': false, 'message': 'Anda belum login'};
      }

      final headers = await _getAuthHeaders();

      final response = await http.get(
        Uri.parse('$baseUrl/users/search?phone=$phone'),
        headers: headers,
      );

      if (response.headers['content-type'] != null &&
          !response.headers['content-type']!.contains('application/json')) {
        return {
          'success': false,
          'message':
              'Server mengembalikan format yang tidak valid: ${response.headers['content-type']}'
        };
      }

      Map<String, dynamic> data;
      try {
        data = jsonDecode(response.body);
      } catch (e) {
        return {
          'success': false,
          'message':
              'Format respons tidak valid: ${e.toString()}\nResponse: ${response.body.substring(0, min(100, response.body.length))}...'
        };
      }

      if (response.statusCode == 200) {
        return {'success': true, 'data': data};
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Gagal mencari pengguna'
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  // Transfer uang ke pengguna lain
  static Future<Map<String, dynamic>> transferMoney(
      String receiverPhone, int amount, String type, String? message) async {
    try {
      final token = await getAuthToken();
      if (token == null || token.isEmpty) {
        return {'success': false, 'message': 'Authentication required'};
      }

      final headers = await _getAuthHeaders();

      final body = {
        'receiverPhone': receiverPhone,
        'amount': amount,
        'type': type,
      };

      if (message != null) {
        body['message'] = message;
      }

      final response = await http.post(
        Uri.parse('$baseUrl/transfer'),
        headers: headers,
        body: jsonEncode(body),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200) {
        return {'success': true, 'data': data};
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Gagal melakukan transfer'
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  // Mengambil pesan antara dua teman
  static Future<Map<String, dynamic>> getMessages(String friendPhone) async {
    try {
      final token = await getAuthToken();
      final response = await http.get(
        Uri.parse('$baseUrl/messages/$friendPhone'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      final data = json.decode(response.body);
      return data;
    } catch (e) {
      return {
        'success': false,
        'message': 'Terjadi kesalahan: $e',
      };
    }
  }

  // Fungsi untuk mengirim pesan
  static Future<Map<String, dynamic>> sendMessage(
      String receiverPhone, String message) async {
    try {
      final token = await getAuthToken();
      final response = await http.post(
        Uri.parse('$baseUrl/messages'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: json.encode({
          'receiverPhone': receiverPhone,
          'message': message,
        }),
      );

      if (response.statusCode == 201) {
        final data = json.decode(response.body);

        return {
          'success': true,
          'message': data['message'] ?? 'Pesan berhasil dikirim',
        };
      } else {
        return {
          'success': false,
          'message': 'Server error: ${response.statusCode}',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message': 'Terjadi kesalahan saat mengirim pesan: $e',
      };
    }
  }

  // Get user profile
  static Future<Map<String, dynamic>> getProfile() async {
    try {
      final token = await getAuthToken();
      if (token == null || token.isEmpty) {
        return {'success': false, 'message': 'Authentication required'};
      }

      final headers = await _getAuthHeaders();
      final response = await http.get(
        Uri.parse('$baseUrl/profile'),
        headers: headers,
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200) {
        return {'success': true, 'data': data};
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Failed to load profile'
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  //## UPDATE PROFILE
  static Future<Map<String, dynamic>> updateProfile(
      String name, String email) async {
    try {
      final token = await getAuthToken();
      if (token == null || token.isEmpty) {
        return {'success': false, 'message': 'Authentication required'};
      }

      final headers = await _getAuthHeaders();

      final response = await http.patch(
        Uri.parse('$baseUrl/profile'),
        headers: headers,
        body: jsonEncode({
          'name': name,
          'email': email,
        }),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200) {
        return {
          'success': true,
        };
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Failed to update profile'
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  //## GANTI PASSWORD
  static Future<Map<String, dynamic>> changePassword(
      String oldPassword, String newPassword) async {
    try {
      final token = await getAuthToken();
      if (token == null || token.isEmpty) {
        return {'success': false, 'message': 'Authentication required'};
      }
      final headers = await _getAuthHeaders();
      final response = await http.patch(
        Uri.parse('$baseUrl/change-password'),
        headers: headers,
        body: jsonEncode({
          'oldPassword': oldPassword,
          'newPassword': newPassword,
        }),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200) {
        return {'success': true, 'message': data['message']};
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Failed to change password'
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  //## GET Income Record
  static Future<Map<String, dynamic>> getIncomeRecords() async {
    try {
      final token = await getAuthToken();
      if (token == null || token.isEmpty) {
        return {'success': false, 'message': 'Authentication required'};
      }
      final headers = await _getAuthHeaders();
      final response = await http.get(
        Uri.parse('$baseUrl/income-record'),
        headers: headers,
      );
      final data = jsonDecode(response.body);
      if (response.statusCode == 200) {
        return {
          'success': true,
          'message': data['message'],
          'records': data['records']
        };
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Gagal mengambil data pemasukan'
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  static Future<Map<String, dynamic>> getExpenseRecords() async {
    try {
      final token = await getAuthToken();
      if (token == null || token.isEmpty) {
        return {'success': false, 'message': 'Authentication required'};
      }

      final headers = await _getAuthHeaders();

      final response = await http.get(
        Uri.parse('$baseUrl/expense-record'),
        headers: headers,
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return {
          'success': true,
          'message': data['message'] ?? 'Data pengeluaran berhasil diambil',
          'records': data['records'] ?? []
        };
      } else {
        Map<String, dynamic> data = {};
        try {
          data = jsonDecode(response.body);
        } catch (e) {
          return {'success': false, 'message': 'Invalid response from server'};
        }

        return {
          'success': false,
          'message': data['message'] ?? 'Gagal mengambil data pengeluaran'
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

//## GET RECENT TRANSACTIONS
  static Future<Map<String, dynamic>> getRecentTransactions() async {
    try {
      final token = await getAuthToken();
      if (token == null || token.isEmpty) {
        return {'success': false, 'message': 'Authentication required'};
      }
      final headers = await _getAuthHeaders();
      final response = await http.get(
        Uri.parse('$baseUrl/recent-transactions'),
        headers: headers,
      );
      final data = jsonDecode(response.body);
      if (response.statusCode == 200) {
        return {
          'success': true,
          'message': data['message'],
          'records': data['records']
        };
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Gagal mengambil data transaksi'
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  static Future<Map<String, dynamic>> getTransactionHistory() async {
    try {
      final token = await getAuthToken();
      if (token == null || token.isEmpty) {
        return {'success': false, 'message': 'Authentication required'};
      }
      final headers = await _getAuthHeaders();
      final response = await http.get(
        Uri.parse('$baseUrl/transaction-history'),
        headers: headers,
      );
      final data = jsonDecode(response.body);
      if (response.statusCode == 200) {
        return {
          'success': true,
          'message': data['message'],
          'records': data['records']
        };
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Gagal mengambil data transaksi'
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  // Bills methods

  // Get all bills for the current user
  static Future<Map<String, dynamic>> getBills() async {
    try {
      final token = await getAuthToken();
      if (token == null || token.isEmpty) {
        return {'success': false, 'message': 'Authentication required'};
      }

      final headers = await _getAuthHeaders();
      final response = await http.get(
        Uri.parse('$baseUrl/bills'),
        headers: headers,
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200) {
        return {'success': true, 'data': data};
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Failed to load bills'
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  // Create a new bill
  static Future<Map<String, dynamic>> createBill(
      String name, double amount, String dueDate, String category) async {
    try {
      final token = await getAuthToken();
      if (token == null || token.isEmpty) {
        return {'success': false, 'message': 'Authentication required'};
      }

      final headers = await _getAuthHeaders();
      final response = await http.post(
        Uri.parse('$baseUrl/bills'),
        headers: headers,
        body: jsonEncode({
          'name': name,
          'amount': amount,
          'dueDate': dueDate,
          'category': category,
        }),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 201 || response.statusCode == 200) {
        return {'success': true, 'data': data};
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Failed to create bill'
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  // Update an existing bill
  static Future<Map<String, dynamic>> updateBill(int id, String name,
      double amount, String dueDate, String category) async {
    try {
      final token = await getAuthToken();
      if (token == null || token.isEmpty) {
        return {'success': false, 'message': 'Authentication required'};
      }

      final headers = await _getAuthHeaders();
      final response = await http.put(
        Uri.parse('$baseUrl/bills/$id'),
        headers: headers,
        body: jsonEncode({
          'name': name,
          'amount': amount,
          'dueDate': dueDate,
          'category': category,
        }),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200) {
        return {'success': true, 'data': data};
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Failed to update bill'
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  // Delete a bill
  static Future<Map<String, dynamic>> deleteBill(int id) async {
    try {
      final token = await getAuthToken();
      if (token == null || token.isEmpty) {
        return {'success': false, 'message': 'Authentication required'};
      }

      final headers = await _getAuthHeaders();
      final response = await http.delete(
        Uri.parse('$baseUrl/bills/$id'),
        headers: headers,
      );

      if (response.statusCode == 200 || response.statusCode == 204) {
        return {'success': true};
      } else {
        final data = jsonDecode(response.body);
        return {
          'success': false,
          'message': data['message'] ?? 'Failed to delete bill'
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  // Savings methods

  // Get all savings
  static Future<Map<String, dynamic>> getSavings() async {
    try {
      final token = await getAuthToken();
      if (token == null || token.isEmpty) {
        return {'success': false, 'message': 'Authentication required'};
      }

      final headers = await _getAuthHeaders();
      final response = await http.get(
        Uri.parse('$baseUrl/savings'),
        headers: headers,
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200) {
        return {'success': true, 'data': data};
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Gagal memuat data tabungan'
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  // Create a new saving
  static Future<Map<String, dynamic>> createSaving(
      String title, String description, int target, int collected) async {
    try {
      final token = await getAuthToken();
      if (token == null || token.isEmpty) {
        return {'success': false, 'message': 'Authentication required'};
      }

      final headers = await _getAuthHeaders();
      final response = await http.post(
        Uri.parse('$baseUrl/savings'),
        headers: headers,
        body: jsonEncode({
          'nama': title,
          'deskripsi': description,
          'target': target,
          'terkumpul': collected,
          'deductFromBalance': collected > 0,
        }),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 201 || response.statusCode == 200) {
        return {'success': true, 'data': data};
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Gagal membuat tabungan baru'
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  // Update an existing saving
  static Future<Map<String, dynamic>> updateSaving(int id, String title,
      String description, int target, int collected) async {
    try {
      final token = await getAuthToken();
      if (token == null || token.isEmpty) {
        return {'success': false, 'message': 'Authentication required'};
      }

      final headers = await _getAuthHeaders();
      final response = await http.put(
        Uri.parse('$baseUrl/savings/$id'),
        headers: headers,
        body: jsonEncode({
          'nama': title,
          'deskripsi': description,
          'target': target,
          'terkumpul': collected,
        }),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200) {
        return {'success': true, 'data': data};
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Gagal memperbarui tabungan'
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  // Update savings target
  static Future<Map<String, dynamic>> updateSavingTarget(
      int id, int target) async {
    try {
      final token = await getAuthToken();
      if (token == null || token.isEmpty) {
        return {'success': false, 'message': 'Authentication required'};
      }

      final headers = await _getAuthHeaders();
      final response = await http.patch(
        Uri.parse('$baseUrl/savings/$id/update-target'),
        headers: headers,
        body: jsonEncode({
          'target': target,
        }),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200) {
        return {'success': true, 'data': data};
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Gagal memperbarui target tabungan'
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  // Add amount to saving
  static Future<Map<String, dynamic>> addToSaving(int id, int amount) async {
    try {
      final token = await getAuthToken();
      if (token == null || token.isEmpty) {
        return {'success': false, 'message': 'Authentication required'};
      }

      final headers = await _getAuthHeaders();

      final response = await http.patch(
        Uri.parse('$baseUrl/savings/$id/add'),
        headers: headers,
        body: jsonEncode({
          'amount': amount,
          'deductFromBalance': true,
        }),
      );

      Map<String, dynamic> data;
      try {
        data = jsonDecode(response.body);
      } catch (e) {
        return {
          'success': false,
          'message':
              'Format respons tidak valid: ${e.toString()}\nResponse: ${response.body.substring(0, min(100, response.body.length))}...'
        };
      }

      if (response.statusCode == 200) {
        return {'success': true, 'data': data};
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Gagal menambahkan dana ke tabungan'
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  // Delete a saving
  static Future<Map<String, dynamic>> deleteSaving(int id) async {
    try {
      final token = await getAuthToken();
      if (token == null || token.isEmpty) {
        return {'success': false, 'message': 'Authentication required'};
      }

      final headers = await _getAuthHeaders();
      final response = await http.delete(
        Uri.parse('$baseUrl/savings/$id'),
        headers: headers,
      );

      if (response.statusCode == 204 || response.statusCode == 200) {
        return {'success': true};
      } else {
        Map<String, dynamic> data = {};
        try {
          data = jsonDecode(response.body);
        } catch (e) {
          return {'success': false, 'message': 'Invalid response from server'};
        }
        return {
          'success': false,
          'message': data['message'] ?? 'Gagal menghapus tabungan'
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  // Withdraw saving
  static Future<Map<String, dynamic>> withdrawSaving(int id) async {
    try {
      final token = await getAuthToken();
      if (token == null || token.isEmpty) {
        return {'success': false, 'message': 'Authentication required'};
      }

      final headers = await _getAuthHeaders();
      final response = await http.post(
        Uri.parse('$baseUrl/savings/$id/withdraw'),
        headers: headers,
      );

      if (response.statusCode == 200) {
        Map<String, dynamic> data = {};
        try {
          data = jsonDecode(response.body);
        } catch (e) {
          return {'success': false, 'message': 'Invalid response from server'};
        }
        return {'success': true, 'data': data};
      } else {
        Map<String, dynamic> data = {};
        try {
          data = jsonDecode(response.body);
        } catch (e) {
          return {'success': false, 'message': 'Invalid response from server'};
        }
        return {
          'success': false,
          'message': data['message'] ?? 'Gagal menarik dana tabungan'
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  // Top Up method
  static Future<Map<String, dynamic>> topUp(String amount) async {
    try {
      final token = await getAuthToken();
      if (token == null || token.isEmpty) {
        return {'success': false, 'message': 'Authentication required'};
      }

      final headers = await _getAuthHeaders();

      final response = await http.post(
        Uri.parse('$baseUrl/topup'),
        headers: headers,
        body: jsonEncode({
          'amount': amount,
        }),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200) {
        return {
          'success': true,
          'message': data['message'] ?? 'Top up berhasil',
          'data': data
        };
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Gagal melakukan top up'
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  //## LOGOUT
  static Future<Map<String, dynamic>> logout() async {
    try {
      final headers = await _getAuthHeaders();
      final response = await http.post(
        Uri.parse('$baseUrl/auth/logout'),
        headers: headers,
      );
      final data = jsonDecode(response.body);

      await clearAuthToken();

      if (response.statusCode == 200) {
        return {
          'success': true,
          'message': data['message'] ?? 'Logout berhasil'
        };
      } else {
        return {'success': false, 'message': data['message'] ?? 'Logout gagal'};
      }
    } catch (e) {
      await clearAuthToken();
      return {'success': true, 'message': 'Logout berhasil'};
    }
  }
}
