import { ApiService } from '../services/apiService.js';
import Setting from '../models/setting_model.js';

export class SignupController {
  constructor() {
    this.model = new Setting();
  }

  updateField(name, value) {
    this.model.setField(name, value);
    return this.model.getSignupData();
  }

  validate() {
    const { password, confirmPassword } = this.model.getSignupData();
    if (password !== confirmPassword) {
      return { valid: false, message: 'Passwords do not match' };
    }
    return { valid: true };
  }

  async register() {
    const { name, phone, email, password } = this.model.getSignupData();
    return await ApiService.register(name, phone, email, password);
  }
}