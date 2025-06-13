class Friend {
  constructor(id = '', name = '', phone = '', avatar = null) {
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.avatar = avatar;
  }

  static fromJson(json) {
    return new Friend(json.id, json.name, json.phone, json.avatar);
  }
}

class FriendRequest {
  constructor(id = '', phone = '', status = 'pending') {
    this.id = id;
    this.phone = phone;
    this.status = status;
  }

  static fromJson(json) {
    return new FriendRequest(json.id, json.name, json.phone, json.status || 'pending');
  }
}

export { Friend, FriendRequest };
