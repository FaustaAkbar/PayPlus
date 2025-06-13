export class SavingsModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.namaSavings = data.namaSavings || '';
    this.deskripsi = data.deskripsi || '';
    this.target = data.target || 0;
    this.terkumpul = data.terkumpul || 0;
  }

  isTargetAchieved() {
    return Number(this.terkumpul) >= Number(this.target);
  }

  static formatCurrency(amount) {
    return `Rp ${Number(amount || 0).toLocaleString('id-ID')}`;
  }
}