import axios from 'axios';
import { io } from 'socket.io-client';

class ApiService {
  // Base URL for the backend API
  static baseUrl = 'http://localhost:3000/api';
  static wsUrl = 'wss://78nvh33s-3000.asse.devtunnels.ms';
  // Token storage key
  static tokenKey = 'auth_token';

  // Axios instance with default config
  static api = axios.create({
    baseURL: ApiService.baseUrl,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Socket.IO helper methods
  static createWebSocketConnection() {
    const token = ApiService.getAuthToken();
    const socket = io(ApiService.wsUrl, {
      query: { token },
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('Socket.IO connection established with ID:', socket.id);
      // Kirim status online saat terhubung
      socket.emit('user_status', { status: 'online' });
    });

    socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket.IO disconnected:', reason);
      // Kirim status offline saat terputus jika memungkinkan
      if (socket.connected) {
        socket.emit('user_status', { status: 'offline' });
      }
    });

    // Tambahkan event untuk window sebelum unload untuk mengirim status offline
    window.addEventListener('beforeunload', () => {
      if (socket.connected) {
        socket.emit('user_status', { status: 'offline' });
      }
    });

    return socket;
  }

  // Method to set auth token in headers
  static async setAuthToken(token) {
    localStorage.setItem(ApiService.tokenKey, token);
    ApiService.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Method to get auth token from storage
  static getAuthToken() {
    return localStorage.getItem(ApiService.tokenKey);
  }

  // Method to clear auth token
  static clearAuthToken() {
    localStorage.removeItem(ApiService.tokenKey);
    delete ApiService.api.defaults.headers.common['Authorization'];
  }

  // Initialize auth token from storage
  static initializeAuth() {
    const token = ApiService.getAuthToken();
    if (token) {
      ApiService.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }

  // Method to check if user is authenticated
  static isAuthenticated() {
    const token = ApiService.getAuthToken();
    return !!token;
  }

  // Login method
  static async login(phone, password) {
    try {
      const response = await ApiService.api.post('/auth/login', {
        phone,
        password,
      });

      if (response.data.token) {
        await ApiService.setAuthToken(response.data.token);
        // Simpan nomor telepon pengguna untuk identifikasi di chat
        localStorage.setItem('user_phone', phone);
      }

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  }

  // Register method
  static async register(name, phone, email, password) {
    try {
      const response = await ApiService.api.post('/auth/register', {
        name,
        phone,
        email,
        password,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  }

  // Logout method
  static async logout() {
    try {
      await ApiService.api.post('/auth/logout');
      ApiService.clearAuthToken();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Logout failed',
      };
    }
  }

  // Get user profile
  static async getProfile() {
    try {
      const response = await ApiService.api.get('/profile');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to load profile',
      };
    }
  }

  // Update profile
  static async updateProfile(name, email) {
    try {
      const response = await ApiService.api.patch('/profile', {
        name,
        email,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile',
      };
    }
  }

  // Change password
  static async changePassword(oldPassword, newPassword) {
    try {
      const response = await ApiService.api.patch('/change-password', {
        oldPassword,
        newPassword,
      });

      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to change password',
      };
    }
  }

  // Get friends list
  static async getFriends() {
    try {
      const response = await ApiService.api.get('/friends');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to load friends',
      };
    }
  }

  // Add friend by phone number
  static async addFriend(friendPhone) {
    try {
      const response = await ApiService.api.post('/friends', {
        friendPhone,
      });

      return {
        success: true,
        message: response.data.message || 'Friend added successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add friend',
      };
    }
  }

  // Get friend requests
  static async getFriendRequests() {
    try {
      const response = await ApiService.api.get('/friends/requests');
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to load friend requests',
      };
    }
  }

  // Respond to friend request (accept/reject)
  static async respondToFriendRequest(requestId, action) {
    try {
      const response = await ApiService.api.patch(`/friends/respond/${requestId}`, {
        action,
      });

      return {
        success: true,
        message: response.data.message || 'Friend request processed',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to process friend request',
      };
    }
  }

  // Delete friend
  static async deleteFriend(friendPhone) {
    try {
      const response = await ApiService.api.delete(`/friends/${friendPhone}`);
      return {
        success: true,
        message: response.data.message || 'Friend removed successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove friend',
      };
    }
  }

  // Search user by phone
  static async searchUser(phone) {
    try {
      const response = await ApiService.api.get(`/users/search?phone=${phone}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to search user',
      };
    }
  }

  // Get user savings
  static async getSavings() {
    try {
      const response = await ApiService.api.get('/savings');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to load savings',
      };
    }
  }

  // Add new savings
  static async addSavings(nama, deskripsi, target) {
    try {
      const response = await ApiService.api.post('/savings', {
        nama,
        deskripsi,
        target: parseInt(target),
      });

      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Savings added successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add savings',
      };
    }
  }

  // Add amount to savings
  static async addToSavings(savingsId, amount) {
    try {
      const response = await ApiService.api.patch(`/savings/${savingsId}/add`, {
        amount: parseInt(amount),
        deductFromBalance: true,
      });
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Amount added to savings successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add amount to savings',
      };
    }
  }

  // Delete savings
  static async deleteSavings(savingsId) {
    try {
      const response = await ApiService.api.delete(`/savings/${savingsId}`);
      return {
        success: true,
        message: response.data.message || 'Savings deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete savings',
      };
    }
  }

  // Update savings target
  static async updateSavingsTarget(savingsId, newTarget) {
    try {
      const targetValue = parseInt(newTarget);
      if (targetValue <= 0) {
        return {
          success: false,
          message: 'Target tabungan tidak boleh 0 atau negatif',
        };
      }

      const response = await ApiService.api.patch(`/savings/${savingsId}/update-target`, {
        target: targetValue,
      });
      return {
        success: true,
        message: response.data.message || 'Target tabungan berhasil diperbarui',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Gagal memperbarui target tabungan',
      };
    }
  }

  // Transfer money
  static async transferMoney(receiverPhone, amount, type, message = null) {
    try {
      const payload = {
        receiverPhone,
        amount,
        type,
      };

      if (message) {
        payload.message = message;
      }

      const response = await ApiService.api.post('/transfer', payload);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to transfer money',
      };
    }
  }

  // Get messages with a friend
  static async getMessages(friendPhone) {
    try {
      const response = await ApiService.api.get(`/messages/${friendPhone}`);
      return {
        success: true,
        messages: response.data.messages,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to load messages',
      };
    }
  }

  // Send message (update untuk menggunakan Socket.IO)
  static async sendMessage(receiverPhone, message) {
    try {
      // Pesan tetap disimpan melalui API untuk persistensi
      const response = await ApiService.api.post('/messages', {
        receiverPhone,
        message,
      });

      return {
        success: true,
        message: response.data.message || 'Message sent successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send message',
      };
    }
  }

  // Get income records
  static async getIncomeRecords() {
    try {
      const response = await ApiService.api.get('/income-record');
      return {
        success: true,
        message: response.data.message,
        records: response.data.records,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to load income records',
      };
    }
  }

  // Get expense records
  static async getExpenseRecords() {
    try {
      const response = await ApiService.api.get('/expense-record');
      return {
        success: true,
        message: response.data.message,
        records: response.data.records,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to load expense records',
      };
    }
  }

  // Get recent transactions
  static async getRecentTransactions() {
    try {
      const response = await ApiService.api.get('/recent-transactions');
      return {
        success: true,
        message: response.data.message,
        records: response.data.records,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to load recent transactions',
      };
    }
  }

  // Get transaction history
  static async getTransactionHistory() {
    try {
      const response = await ApiService.api.get('/transaction-history');
      return {
        success: true,
        message: response.data.message,
        records: response.data.records,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to load transaction history',
      };
    }
  }

  // Get bills
  static async getBills() {
    try {
      const response = await ApiService.api.get('/bills');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to load bills',
      };
    }
  }

  // Add new bill
  static async addBill(name, amount, dueDate, category) {
    try {
      const response = await ApiService.api.post('/bills', {
        name,
        amount,
        dueDate,
        category,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add bill',
      };
    }
  }

  // Update bill
  static async updateBill(billId, name, amount, dueDate, category) {
    try {
      const response = await ApiService.api.put(`/bills/${billId}`, {
        name,
        amount,
        dueDate,
        category,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update bill',
      };
    }
  }

  // Delete bill
  static async deleteBill(billId) {
    try {
      const response = await ApiService.api.delete(`/bills/${billId}`);

      return {
        success: true,
        message: response.data.message || 'Bill deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete bill',
      };
    }
  }

  // Top up balance
  static async topup(amount) {
    try {
      const response = await ApiService.api.post('/topup', {
        amount: parseInt(amount),
      });

      return {
        success: true,
        message: response.data.message || 'Top up successful',
        data: {
          amount: response.data.amount,
          newBalance: response.data.newBalance,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to top up',
      };
    }
  }

  // Send message to chatbot
  static async sendChatbotMessage(message) {
    try {
      const response = await ApiService.api.post('/chatbot', {
        message,
      });

      return {
        success: true,
        response: response.data.response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get chatbot response',
      };
    }
  }
}

// Initialize authentication on load
ApiService.initializeAuth();

export default ApiService;
export { ApiService };
