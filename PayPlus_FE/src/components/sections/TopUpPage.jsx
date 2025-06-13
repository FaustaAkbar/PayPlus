"use client" // Menandakan bahwa komponen ini dirender di sisi klien

// Import library dan hooks dari React
import { useState, useEffect } from "react" // useState untuk state lokal, useEffect untuk efek samping
import { Link, useNavigate } from "react-router-dom" // Link untuk navigasi tanpa refresh, useNavigate untuk navigasi programatis
import TopUpController from "../../controllers/TopUpController" // Controller untuk logika bisnis top up
import {
  Menu, // Icon untuk menu
  X, // Icon untuk tombol close
  Wallet, // Icon dompet
  ChevronDown, // Icon panah ke bawah
  CreditCard, // Icon kartu kredit
  ArrowRight, // Icon panah ke kanan
  Check, // Icon centang
  AlertCircle, // Icon peringatan
  Clock, // Icon jam
  ChevronLeft, // Icon panah ke kiri
} from "lucide-react" // Library untuk icon

// Import gambar logo bank
import BRI from "../../assets/BRI.png" // Logo Bank BRI
import BCA from "../../assets/BCA.png" // Logo Bank BCA
import BNI from "../../assets/BNI.png" // Logo Bank BNI
import Mandiri from "../../assets/mandiri.png" // Logo Bank Mandiri
import Jatim from "../../assets/jatim.png" // Logo Bank Jatim
import Bali from "../../assets/bali.png" // Logo Bank Bali
import BJB from "../../assets/bjb.png" // Logo Bank BJB
import Kalteng from "../../assets/kalteng.png" // Logo Bank Kalteng
import Sumsel from "../../assets/sumsel.png" // Logo Bank Sumsel

// Array pilihan bank yang tersedia untuk top up
const bankOptions = [
  { name: "BRI", image: BRI }, // Opsi Bank BRI dengan gambar logo
  { name: "Mandiri", image: Mandiri }, // Opsi Bank Mandiri dengan gambar logo
  { name: "Bank Jatim", image: Jatim }, // Opsi Bank Jatim dengan gambar logo
  { name: "Bank Bali", image: Bali }, // Opsi Bank Bali dengan gambar logo
  { name: "Bank BJB", image: BJB }, // Opsi Bank BJB dengan gambar logo
  { name: "Bank Kalteng", image: Kalteng }, // Opsi Bank Kalteng dengan gambar logo
  { name: "Bank Sumsel", image: Sumsel }, // Opsi Bank Sumsel dengan gambar logo
]

// Komponen utama halaman Top Up
export const TopUpPage = () => {
  const navigate = useNavigate() // Hook untuk navigasi programatis
  const [controller] = useState(new TopUpController()) // Inisialisasi controller untuk logika bisnis
  const [selectedBank, setSelectedBank] = useState(bankOptions[0].name) // State untuk menyimpan bank yang dipilih, default bank pertama
  const [topup, setTopup] = useState("") // State untuk menyimpan jumlah top up
  const [loading, setLoading] = useState(false) // State untuk menandakan proses loading
  const [result, setResult] = useState(null) // State untuk menyimpan hasil top up
  const [error, setError] = useState("") // State untuk menyimpan pesan error
  const [redirectCountdown, setRedirectCountdown] = useState(null) // State untuk countdown redirect
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false) // State untuk status menu mobile
  const [bankDropdownOpen, setBankDropdownOpen] = useState(false) // State untuk status dropdown bank
  const [quickAmounts] = useState([50000, 100000, 200000, 500000, 1000000]) // State untuk opsi jumlah cepat

  // Effect untuk menangani countdown redirect ke dashboard setelah top up berhasil
  useEffect(() => {
    let timer // Variabel untuk menyimpan timer
    if (redirectCountdown !== null) { // Jika countdown aktif
      if (redirectCountdown <= 0) { // Jika countdown sudah habis
        navigate("/Dashboard") // Navigasi ke halaman Dashboard
      } else { // Jika countdown masih berjalan
        timer = setTimeout(() => { // Set timer untuk update countdown
          const newCountdown = controller.updateRedirectCountdown() // Update countdown dari controller
          setRedirectCountdown(newCountdown) // Update state countdown
        }, 1000) // Interval 1 detik
      }
    }
    return () => clearTimeout(timer) // Cleanup timer saat komponen unmount
  }, [redirectCountdown, navigate, controller]) // Dependency array

  // Fungsi untuk menangani perubahan bank yang dipilih
  const handleBankChange = (bankName) => {
    controller.setSelectedBank(bankName) // Update bank di controller
    setSelectedBank(bankName) // Update state bank yang dipilih
    setBankDropdownOpen(false) // Tutup dropdown bank
  }

  // Fungsi untuk menangani submit form top up
  const handleSubmit = async (e) => {
    e.preventDefault() // Mencegah refresh halaman
    setLoading(true) // Set loading menjadi true
    controller.setTopupAmount(topup) // Set jumlah top up di controller

    const response = await controller.submitTopUp() // Kirim request top up ke server

    if (response.success) { // Jika top up berhasil
      setResult(response.result) // Set hasil top up
      setRedirectCountdown(response.redirectCountdown) // Set countdown redirect
    } else { // Jika top up gagal
      setError(response.error) // Set pesan error
    }

    setLoading(false) // Set loading menjadi false
  }

  // Fungsi untuk memformat angka menjadi format mata uang Indonesia
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", { // Format untuk Indonesia
      style: "decimal", // Style decimal
      maximumFractionDigits: 0, // Tanpa desimal
    }).format(amount) // Format angka
  }

  // Fungsi untuk menangani klik pada tombol jumlah cepat
  const handleQuickAmountClick = (amount) => {
    setTopup(amount.toString()) // Set jumlah top up sesuai tombol yang diklik
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"> {/* Container utama dengan background gradient */}
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10"> {/* Header dengan posisi sticky */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8"> {/* Container dengan responsive padding */}
          <div className="flex justify-between items-center py-4"> {/* Flex container untuk header */}
            <div className="flex items-center"> {/* Container untuk logo */}
              <Link to="/dashboard"> {/* Link ke dashboard */}
                <img src="https://github.com/ThePayPlus/PayPlus_FE/blob/main/public/Logo.png?raw=true" alt="PayPlus Logo" className="h-10" /> {/* Logo PayPlus */}
              </Link>
            </div>
            {/* Navigation */}
            <nav className="hidden sm:flex space-x-4"> {/* Navigasi desktop, tersembunyi di mobile */}
              <Link to="/topUp" className="text-indigo-600 font-medium border-b-2 border-indigo-600 hover:text-indigo-800 transition-colors duration-200"> {/* Link aktif */}
                Top-Up
              </Link>
              <Link to="/transfer" className="text-gray-600 hover:text-gray-800 transition-colors duration-200"> {/* Link navigasi */}
                Transfer
              </Link>
              <Link to="/bills" className="text-gray-600 hover:text-gray-800 transition-colors duration-200"> {/* Link navigasi */}
                Bills
              </Link>
              <Link to="/expense" className="text-gray-600 hover:text-gray-800 transition-colors duration-200"> {/* Link navigasi */}
                Expenses
              </Link>
              <Link to="/income" className="text-gray-600 hover:text-gray-800 transition-colors duration-200"> {/* Link navigasi */}
                Income
              </Link>
              <Link to="/savings" className="text-gray-600 hover:text-gray-800 transition-colors duration-200"> {/* Link navigasi */}
                Savings
              </Link>
              <Link to="/friends" className="text-gray-600 hover:text-gray-800 transition-colors duration-200"> {/* Link navigasi */}
                Friends
              </Link>
            </nav>
            {/* Mobile menu button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"> {/* Tombol menu mobile */}
              {mobileMenuOpen ? <X className="w-6 h-6 text-gray-600" /> : <Menu className="w-6 h-6 text-gray-600" />} {/* Icon sesuai status menu */}
            </button>
          </div>
          {/* Mobile Navigation */}
          {mobileMenuOpen && ( // Tampilkan navigasi mobile jika menu terbuka
            <div className="sm:hidden py-4 border-t border-gray-200"> {/* Container navigasi mobile */}
              <nav className="flex flex-col space-y-4"> {/* Navigasi mobile dengan layout kolom */}
                <Link to="/topUp" className="text-indigo-600 font-medium border-b-2 border-indigo-600 hover:text-indigo-800 transition-colors duration-200" onClick={() => setMobileMenuOpen(false)}> {/* Link aktif */}
                  Top-Up
                </Link>
                <Link to="/transfer" className="text-gray-600 hover:text-gray-800 transition-colors duration-200" onClick={() => setMobileMenuOpen(false)}> {/* Link navigasi */}
                  Transfer
                </Link>
                <Link to="/bills" className="text-gray-600 hover:text-gray-800 transition-colors duration-200" onClick={() => setMobileMenuOpen(false)}> {/* Link navigasi */}
                  Bills
                </Link>
                <Link to="/Expense" className="text-gray-600 hover:text-gray-800 transition-colors duration-200" onClick={() => setMobileMenuOpen(false)}> {/* Link navigasi */}
                  Expenses
                </Link>
                <Link to="/Income" className="text-gray-600 hover:text-gray-800 transition-colors duration-200" onClick={() => setMobileMenuOpen(false)}> {/* Link navigasi */}
                  Income
                </Link>
                <Link to="/savings" className="text-gray-600 hover:text-gray-800 transition-colors duration-200" onClick={() => setMobileMenuOpen(false)}> {/* Link navigasi */}
                  Savings
                </Link>
                <Link to="/Friends" className="text-gray-600 hover:text-gray-800 transition-colors duration-200" onClick={() => setMobileMenuOpen(false)}> {/* Link navigasi */}
                  Friends
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8"> {/* Container utama konten */}
        <div className="max-w-md mx-auto"> {/* Container dengan lebar maksimum */}
          <div className="text-center mb-8"> {/* Header konten */}
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Top Up Your Account</h1> {/* Judul halaman */}
            <p className="text-slate-600">Add funds to your PayPlus wallet</p> {/* Deskripsi halaman */}
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8"> {/* Card utama dengan efek glassmorphism */}
            {!result ? ( // Tampilkan form jika belum ada hasil top up
              <>
                {/* Bank Selection */}
                <div className="mb-8"> {/* Container pemilihan bank */}
                  <label className="block text-lg font-semibold text-slate-900 mb-4">Select Bank</label> {/* Label pemilihan bank */}
                  <div className="relative"> {/* Container relatif untuk dropdown */}
                    <button
                      type="button"
                      className="w-full flex items-center justify-between p-4 bg-white border-2 border-slate-200 rounded-xl hover:border-blue-300 transition-all duration-200"
                      onClick={() => setBankDropdownOpen(!bankDropdownOpen)} // Toggle dropdown bank
                    >
                      <div className="flex items-center"> {/* Container untuk logo dan nama bank */}
                        <img
                          src={bankOptions.find((bank) => bank.name === selectedBank).image || "/placeholder.svg"} // Gambar bank yang dipilih
                          alt={selectedBank} // Alt text
                          className="h-8 w-auto mr-3" // Style gambar
                        />
                        <span className="font-medium text-slate-900">{selectedBank}</span> {/* Nama bank yang dipilih */}
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                          bankDropdownOpen ? "transform rotate-180" : "" // Rotasi icon saat dropdown terbuka
                        }`}
                      />
                    </button>

                    {bankDropdownOpen && ( // Tampilkan dropdown jika status terbuka
                      <div className="absolute z-10 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"> {/* Container dropdown */}
                        {bankOptions.map((bank, index) => ( // Mapping opsi bank
                          <button
                            key={index} // Key untuk mapping
                            type="button"
                            className="w-full flex items-center p-3 hover:bg-blue-50 transition-colors duration-200" // Style button
                            onClick={() => handleBankChange(bank.name)} // Handler klik bank
                          >
                            <img src={bank.image || "/placeholder.svg"} alt={bank.name} className="h-8 w-auto mr-3" /> {/* Logo bank */}
                            <span className="font-medium text-slate-900">{bank.name}</span> {/* Nama bank */}
                            {selectedBank === bank.name && <Check className="w-5 h-5 text-blue-600 ml-auto" />} {/* Tanda centang jika bank dipilih */}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Amount Input */}
                <form onSubmit={handleSubmit}> {/* Form untuk input jumlah top up */}
                  <div className="mb-8"> {/* Container input jumlah */}
                    <label htmlFor="amount" className="block text-lg font-semibold text-slate-900 mb-4">
                      Amount {/* Label input jumlah */}
                    </label>
                    <div className="relative"> {/* Container relatif untuk input */}
                      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none"> {/* Container untuk simbol mata uang */}
                        <span className="text-slate-500 font-semibold text-xl">Rp</span> {/* Simbol Rupiah */}
                      </div>
                      <input
                        type="text" // Tipe input teks
                        id="amount" // ID input
                        value={topup} // Value dari state
                        onChange={(e) => { // Handler perubahan input
                          const value = e.target.value.replace(/[^0-9]/g, "") // Filter hanya angka
                          setTopup(value) // Update state
                        }}
                        className="pl-16 pr-6 py-4 w-full bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-2xl font-semibold transition-all duration-200" // Style input
                        placeholder="0" // Placeholder
                        required // Wajib diisi
                      />
                    </div>
                    {topup && <p className="mt-3 text-slate-600 text-lg">Rp {formatCurrency(topup)}</p>} {/* Tampilkan format mata uang jika ada input */}
                  </div>

                  {/* Quick Amount Buttons */}
                  <div className="mb-8"> {/* Container tombol jumlah cepat */}
                    <label className="block text-sm font-medium text-slate-700 mb-3">Quick Amounts</label> {/* Label tombol jumlah cepat */}
                    <div className="grid grid-cols-3 gap-3"> {/* Grid 3 kolom untuk tombol */}
                      {quickAmounts.map((amount) => ( // Mapping jumlah cepat
                        <button
                          key={amount} // Key untuk mapping
                          type="button"
                          onClick={() => handleQuickAmountClick(amount)} // Handler klik jumlah cepat
                          className={`p-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium ${
                            topup === amount.toString() // Style berbeda jika jumlah dipilih
                              ? "border-blue-500 bg-blue-50 text-blue-700" // Style aktif
                              : "border-slate-200 hover:border-blue-300 text-slate-700 hover:bg-blue-50" // Style tidak aktif
                          }`}
                        >
                          Rp {formatCurrency(amount)} {/* Tampilkan jumlah dengan format mata uang */}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && ( // Tampilkan pesan error jika ada
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-start"> {/* Container pesan error */}
                      <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" /> {/* Icon peringatan */}
                      <p>{error}</p> {/* Pesan error */}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit" // Tipe submit
                    disabled={loading || !topup} // Disable jika loading atau tidak ada input
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" // Style button
                  >
                    {loading ? ( // Tampilkan loading jika sedang proses
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div> {/* Loading spinner */}
                        Processing... {/* Teks loading */}
                      </>
                    ) : ( // Tampilkan teks konfirmasi jika tidak loading
                      <>
                        Confirm Top Up {/* Teks konfirmasi */}
                        <ArrowRight className="w-5 h-5 ml-2" /> {/* Icon panah kanan */}
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : ( // Tampilkan hasil jika top up berhasil
              <div className="text-center"> {/* Container hasil top up */}
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"> {/* Container icon sukses */}
                  <Check className="w-10 h-10 text-green-500" /> {/* Icon centang */}
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Top Up Successful!</h2> {/* Judul sukses */}
                <p className="text-green-600 font-medium mb-6">{result.message}</p> {/* Pesan sukses */}

                <div className="bg-slate-50 rounded-xl p-6 mb-6"> {/* Container detail hasil */}
                  <div className="flex justify-between mb-3"> {/* Baris jumlah */}
                    <span className="text-slate-600">Amount</span> {/* Label jumlah */}
                    <span className="font-semibold text-slate-900">Rp {formatCurrency(result.amount)}</span> {/* Jumlah top up */}
                  </div>
                  <div className="flex justify-between"> {/* Baris saldo baru */}
                    <span className="text-slate-600">New Balance</span> {/* Label saldo baru */}
                    <span className="font-semibold text-slate-900">Rp {formatCurrency(result.newBalance)}</span> {/* Saldo baru */}
                  </div>
                </div>

                {redirectCountdown !== null && ( // Tampilkan countdown jika ada
                  <div className="flex items-center justify-center text-blue-600 mb-6"> {/* Container countdown */}
                    <Clock className="w-5 h-5 mr-2" /> {/* Icon jam */}
                    <p>
                      Redirecting to Dashboard in {redirectCountdown} second{redirectCountdown !== 1 ? "s" : ""}... {/* Teks countdown */}
                    </p>
                  </div>
                )}

                <Link
                  to="/dashboard" // Link ke dashboard
                  className="inline-flex items-center justify-center w-full py-3 px-6 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200" // Style button
                >
                  Go to Dashboard {/* Teks button */}
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}