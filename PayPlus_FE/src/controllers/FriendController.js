import { ApiService } from '../services/apiService.js';
import { Friend, FriendRequest } from '../models/FriendModel.js';

class FriendController {
  // Mengambil daftar teman
  static async getFriends() {
    try {
      const response = await ApiService.getFriends();

      if (response.success) {
        // Convert raw data to Friend model instances
        const friends = Array.isArray(response.data.friends) ? response.data.friends.map((friend) => Friend.fromJson(friend)) : [];

        return {
          success: true,
          friends: friends,
        };
      } else {
        return {
          success: false,
          message: response.message || 'Failed to load friends',
        };
      }
    } catch (err) {
      console.error('Friends fetch error:', err);
      return {
        success: false,
        message: 'An unexpected error occurred',
      };
    }
  }

  // Menambahkan teman
  static async addFriend(phoneNumber) {
    if (!phoneNumber.trim()) {
      return {
        success: false,
        message: 'Please enter a phone number',
      };
    }

    const myPhone = localStorage.getItem('user_phone');
    if (phoneNumber === myPhone) {
      return {
        success: false,
        message: 'You cannot add yourself as a friend',
      };
    }

    try {
      // First search if user exists
      const searchResponse = await ApiService.searchUser(phoneNumber);

      if (!searchResponse.success) {
        return {
          success: false,
          message: 'User not found. Please check the phone number.',
        };
      }

      // If user exists, send friend request
      const response = await ApiService.addFriend(phoneNumber);
      return response;
    } catch (err) {
      console.error('Add friend error:', err);
      return {
        success: false,
        message: 'An unexpected error occurred',
      };
    }
  }

  // Mengambil permintaan pertemanan
  static async getFriendRequests() {
    try {
      const response = await ApiService.getFriendRequests();

      if (response.success) {
        const requests = Array.isArray(response.data) ? response.data.map((request) => FriendRequest.fromJson(request)) : [];

        return {
          success: true,
          requests: requests,
        };
      } else {
        return {
          success: false,
          message: response.message || 'Failed to load friend requests',
        };
      }
    } catch (err) {
      console.error('Friend requests fetch error:', err);
      return {
        success: false,
        message: 'Failed to load friend requests',
      };
    }
  }

  // Menanggapi permintaan pertemanan
  static async respondToFriendRequest(requestId, action) {
    try {
      const response = await ApiService.respondToFriendRequest(requestId, action);
      return response;
    } catch (err) {
      console.error('Friend request action error:', err);
      return {
        success: false,
        message: 'An unexpected error occurred',
      };
    }
  }

  // Menghapus teman
  static async deleteFriend(friendPhone) {
    try {
      const response = await ApiService.deleteFriend(friendPhone);
      return response;
    } catch (err) {
      console.error('Delete friend error:', err);
      return {
        success: false,
        message: 'An unexpected error occurred',
      };
    }
  }

  // Menampilkan notifikasi browser
  static showNotification(title, body) {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, { body });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            new Notification(title, { body });
          }
        });
      }
    }
  }
}

export default FriendController;
