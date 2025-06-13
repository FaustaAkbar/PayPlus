class Message {
  constructor(id = '', sender = '', receiver = '', message = '', sent_at = new Date().toISOString(), isLocalMessage = false) {
    this.id = id;
    this.sender = sender;
    this.receiver = receiver;
    this.message = message;
    this.sent_at = sent_at;
    this.isLocalMessage = isLocalMessage;
  }

  static fromJson(json) {
    return new Message(json.id || '', json.sender || json.sender_phone || '', json.receiver || json.receiver_phone || '', json.message || '', json.sent_at || new Date().toISOString(), json.isLocalMessage || false);
  }

  isSentByMe() {
    const myPhone = localStorage.getItem('user_phone');
    return String(this.sender) === String(myPhone);
  }

  formatTime() {
    const date = new Date(this.sent_at);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  formatDate() {
    const date = new Date(this.sent_at);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  formatDateTime() {
    const date = new Date(this.sent_at);
    return `${date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
}

export default Message;
