import ApiService from '../services/apiService';
import ChatbotMessage from '../models/ChatbotModel';

class ChatbotController {
  constructor() {
    this.chatHistory = [];
    this.isLoading = false;
  }

  /**
   * @param {string} message
   * @returns {Promise<ChatbotMessage>}
   */
  async sendMessage(message) {
    this.isLoading = true;

    try {
      const newMessage = new ChatbotMessage(Date.now().toString(), message, '', new Date());

      newMessage.isLoading = true;
      this.chatHistory.push(newMessage);

      // Kirim pesan ke API
      const response = await ApiService.sendChatbotMessage(message);

      if (response.success) {
        // Update pesan dengan respons
        newMessage.response = response.response;
        newMessage.isLoading = false;
      } else {
        // Handle error
        newMessage.response = 'Maaf, terjadi kesalahan saat memproses pesan Anda. Silakan coba lagi nanti.';
        newMessage.isLoading = false;
      }

      return newMessage;
    } catch (error) {
      console.error('Error sending message to chatbot:', error);

      // Buat pesan error
      const errorMessage = new ChatbotMessage(Date.now().toString(), message, 'Maaf, terjadi kesalahan saat berkomunikasi dengan server. Silakan coba lagi nanti.', new Date());

      this.chatHistory.push(errorMessage);
      return errorMessage;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Mendapatkan seluruh riwayat chat
   * @returns {Array<ChatbotMessage>}
   */
  getChatHistory() {
    return this.chatHistory;
  }

  clearChatHistory() {
    this.chatHistory = [];
  }
}

export default ChatbotController;
