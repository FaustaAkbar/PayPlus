class ChatbotMessage {
  constructor(id = null, message = '', response = '', timestamp = new Date()) {
    this.id = id;
    this.message = message;
    this.response = response;
    this.timestamp = timestamp;
    this.isLoading = false;
  }

  static fromJson(json) {
    return new ChatbotMessage(json.id || null, json.message || '', json.response || '', json.timestamp ? new Date(json.timestamp) : new Date());
  }

  toJson() {
    return {
      id: this.id,
      message: this.message,
      response: this.response,
      timestamp: this.timestamp,
    };
  }
}

export default ChatbotMessage;
