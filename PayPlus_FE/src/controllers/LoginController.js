import { ApiService } from '../services/apiService.js';
import Setting from '../models/setting_model.js';

export class LoginController {
  constructor() {
    this.model = new Setting();
  }

  updateField(name, value) {
    this.model.setField(name, value);
    return this.model.getLoginData();
  }

  async login() {
    const { phone, password } = this.model.getLoginData();
    return await ApiService.login(phone, password);
  }
}