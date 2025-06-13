import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:payplus_mobile/app/routes/app_pages.dart';

class TopUpPage extends StatefulWidget {
  const TopUpPage({super.key});

  @override
  State<TopUpPage> createState() => _TopUpPageState();
}

class _TopUpPageState extends State<TopUpPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F4F8),
      appBar: AppBar(
        title: const Text("Let's Top Up",
            style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Get.offAllNamed('/home'),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 30),
                const Text(
                  'How would you like to top up PayPlus Balance?',
                  style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 20),
                const Text(
                  'BANK',
                  style: TextStyle(
                    fontSize: 12,
                    color: Color.fromARGB(255, 107, 107, 107),
                  ),
                ),
                const SizedBox(height: 10),
                _buildBankOption('assets/images/BRI.png', 'BRI'),
                _buildBankOption('assets/images/BCA.png', 'BCA'),
                _buildBankOption('assets/images/BNI.png', 'BNI'),
                _buildBankOption('assets/images/mandiri.png', 'Mandiri'),
                _buildBankOption('assets/images/jatim.png', 'Bank Jatim',
                    width: 100),
                _buildBankOption('assets/images/bali.png', 'Bank Bali',
                    width: 40),
                _buildBankOption('assets/images/bjb.png', 'Bank BJB'),
                _buildBankOption('assets/images/kalteng.png', 'Bank Kalteng',
                    width: 100),
                _buildBankOption('assets/images/sumsel.png', 'Bank Sumsel',
                    width: 100),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildBankOption(String imagePath, String bankName,
      {double width = 60}) {
    return GestureDetector(
      onTap: () {
        Get.toNamed(Routes.TOPUPAMOUNT);
      },
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 8),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withAlpha(30),
              blurRadius: 4,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Image.asset(
              imagePath,
              height: 60,
              width: width,
            ),
            const Icon(Icons.arrow_forward_ios, size: 16, color: Colors.grey),
          ],
        ),
      ),
    );
  }
}
