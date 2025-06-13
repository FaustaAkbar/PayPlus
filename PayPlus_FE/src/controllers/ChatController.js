import { ApiService } from '../services/apiService.js';
import Message from '../models/MessageModel.js';

class ChatController {
  // Mengambil pesan dengan teman
  static async getMessages(friendPhone) {
    try {
      const response = await ApiService.getMessages(friendPhone);

      if (response.success) {
        // Convert raw data to Message model instances
        const messages = Array.isArray(response.messages) ? response.messages.map((message) => Message.fromJson(message)) : [];

        return {
          success: true,
          messages: messages,
        };
      } else {
        return {
          success: false,
          message: response.message || 'Failed to load messages',
        };
      }
    } catch (err) {
      console.error('Messages fetch error:', err);
      return {
        success: false,
        message: 'An unexpected error occurred',
      };
    }
  }

  // Mengirim pesan
  static sendMessage(ws, messageData, callback) {
    if (!messageData.receiver || !messageData.message.trim()) {
      return {
        success: false,
        message: 'Receiver and message are required',
      };
    }

    try {
      // Send via Socket.IO
      ws.emit('message', messageData, (acknowledgement) => {
        console.log('Message acknowledgement:', acknowledgement);

        // Callback with result
        if (callback) {
          if (!acknowledgement || !acknowledgement.error) {
            // Create local message object
            const myPhone = localStorage.getItem('user_phone');
            const newMsg = new Message('', myPhone, messageData.receiver, messageData.message, new Date().toISOString(), true);

            callback({
              success: true,
              message: newMsg,
            });
          } else {
            callback({
              success: false,
              message: acknowledgement.error || 'Failed to send message',
            });
          }
        }
      });

      return { success: true };
    } catch (err) {
      console.error('Send message error:', err);
      return {
        success: false,
        message: 'An unexpected error occurred',
      };
    }
  }

  // Menangani indikator mengetik
  static sendTypingIndicator(ws, receiverPhone) {
    if (!receiverPhone) return;

    try {
      ws.emit('typing', { receiver: receiverPhone });
      return true;
    } catch (err) {
      console.error('Send typing indicator error:', err);
      return false;
    }
  }

  // Menangani indikator berhenti mengetik
  static sendStopTypingIndicator(ws, receiverPhone) {
    if (!receiverPhone) return;

    try {
      ws.emit('stop-typing', { receiver: receiverPhone });
      return true;
    } catch (err) {
      console.error('Send stop typing indicator error:', err);
      return false;
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

  // Bergabung dengan chat room
  static joinChatRoom(ws, friendPhone) {
    if (!ws || !friendPhone) return false;

    try {
      ws.emit('join-chat', { friendPhone });
      return true;
    } catch (err) {
      console.error('Join chat room error:', err);
      return false;
    }
  }
}

export default ChatController;
