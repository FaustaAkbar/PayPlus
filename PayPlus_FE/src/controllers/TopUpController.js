// Import ApiService dari services untuk melakukan operasi API terkait top-up
import { ApiService } from '../services/apiService';

// Mendefinisikan dan mengekspor kelas TopUpController yang menangani logika bisnis untuk fitur top-up
export class TopUpController {
  // Constructor untuk inisialisasi objek TopUpController dengan nilai default
  constructor() {
    this.selectedBank = null;      // Menyimpan informasi bank yang dipilih oleh pengguna
    this.topupAmount = '';         // Menyimpan jumlah top-up yang dimasukkan pengguna (string kosong sebagai nilai awal)
    this.loading = false;          // Flag untuk menandakan status loading saat proses top-up berlangsung
    this.result = null;            // Menyimpan hasil operasi top-up yang berhasil
    this.error = '';               // Menyimpan pesan error jika terjadi kesalahan
    this.redirectCountdown = null; // Penghitung mundur untuk redirect setelah top-up berhasil
  }

  // Method untuk mengatur bank yang dipilih pengguna
  // Parameter: bank - objek bank yang dipilih
  // Return: objek bank yang telah diset
  setSelectedBank(bank) {
    this.selectedBank = bank;      // Menyimpan objek bank ke property selectedBank
    return this.selectedBank;      // Mengembalikan nilai bank yang telah diset
  }

  // Method untuk mengatur jumlah top-up
  // Parameter: amount - jumlah top-up yang dimasukkan pengguna
  // Return: nilai amount yang telah diset
  setTopupAmount(amount) {
    this.topupAmount = amount;     // Menyimpan jumlah top-up ke property topupAmount
    return this.topupAmount;       // Mengembalikan nilai amount yang telah diset
  }

  // Method async untuk melakukan proses top-up
  // Return: objek yang berisi status keberhasilan dan data hasil top-up atau pesan error
  async submitTopUp() {
    this.loading = true;           // Mengaktifkan status loading
    this.error = '';               // Mengosongkan pesan error sebelumnya
    this.result = null;            // Mengosongkan hasil sebelumnya
    this.redirectCountdown = null; // Mengosongkan penghitung mundur sebelumnya
    
    try {
      // Memanggil API top-up melalui ApiService dengan jumlah yang telah diset
      const response = await ApiService.topup(this.topupAmount);
      
      // Jika top-up berhasil (response success = true)
      if (response.success) {
        // Menyimpan hasil top-up ke property result
        this.result = {
          message: response.message,           // Pesan sukses dari server
          amount: response.data.amount,        // Jumlah top-up yang berhasil
          newBalance: response.data.newBalance // Saldo baru setelah top-up
        };
        this.redirectCountdown = 3;            // Mengatur penghitung mundur redirect ke 3 detik
        // Mengembalikan objek hasil dengan status sukses
        return { success: true, result: this.result, redirectCountdown: this.redirectCountdown };
      } else {
        // Jika top-up gagal, simpan pesan error dari server
        this.error = response.message;
        // Mengembalikan objek hasil dengan status gagal
        return { success: false, error: this.error };
      }
    } catch (error) {
      // Menangkap error yang terjadi selama proses API call
      console.error('Topup error:', error);    // Mencatat error ke console untuk debugging
      this.error = 'An error occurred while topping up'; // Mengatur pesan error generic
      // Mengembalikan objek hasil dengan status gagal
      return { success: false, error: this.error };
    } finally {
      // Blok finally akan selalu dijalankan, baik proses berhasil atau gagal
      this.loading = false;        // Menonaktifkan status loading
    }
  }

  // Method untuk memperbarui penghitung mundur redirect
  // Return: nilai penghitung mundur terbaru
  updateRedirectCountdown() {
    // Jika penghitung mundur ada (tidak null) dan masih lebih dari 0
    if (this.redirectCountdown !== null && this.redirectCountdown > 0) {
      this.redirectCountdown -= 1; // Kurangi penghitung mundur sebanyak 1
    }
    return this.redirectCountdown;  // Mengembalikan nilai penghitung mundur terbaru
  }
}

// Mengekspor TopUpController sebagai default export
export default TopUpController;