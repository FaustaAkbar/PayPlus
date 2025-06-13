class Setting {
  constructor(name = '', email = '', phone = '', profileImage = null, password = '', confirmPassword = '', rememberMe = false) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.profileImage = profileImage;
    this.password = password;
    this.confirmPassword = confirmPassword;
    this.rememberMe = rememberMe;
  }

  static fromJson(json) {
    return new Setting(
      json.name || '',
      json.email || '',
      json.phone || '',
      null
    );
  }

  setField(field, value) {
    this[field] = value;
  }

  getData() {
    return {
      name: this.name,
      phone: this.phone,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword,
      rememberMe: this.rememberMe,
      profileImage: this.profileImage
    };
  }

  // Method khusus untuk login
  getLoginData() {
    return {
      phone: this.phone,
      password: this.password,
      rememberMe: this.rememberMe
    };
  }

  // Method khusus untuk signup
  getSignupData() {
    return {
      name: this.name,
      phone: this.phone,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword
    };
  }
}

export default Setting;