import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:payplus_mobile/app/routes/app_pages.dart';
import 'package:payplus_mobile/app/theme/app_theme.dart';
import '../controllers/home_controller.dart';

class HomeView extends GetView<HomeController> {
  const HomeView({super.key});

  static const Color primaryColor = Color(0xFF6C63FF);
  static const Color primaryDarkColor = Color(0xFF4B0082);
  static const Color successColor = Color(0xFF4CAF50);
  static const Color dangerColor = Color(0xFFFF6B6B);
  static const Color textDarkColor = Color(0xFF1F2937);
  static const Color textMediumColor = Color(0xFF666666);
  static const Color bgColor = Color(0xFFF9FAFB);
  static const Color cardColor = Colors.white;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: bgColor,
      body: SingleChildScrollView(
        padding: const EdgeInsets.only(
            top: 61.0, bottom: 16.0, left: 16.0, right: 16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              margin: const EdgeInsets.only(bottom: 16),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  GestureDetector(
                    onTap: () => Get.offAllNamed(Routes.SETTING),
                    child: CircleAvatar(
                      radius: 24,
                      backgroundColor: AppTheme.primaryPurple,
                      child: Obx(() => Text(
                            controller.name.isNotEmpty
                                ? controller.name.value
                                    .substring(0, 2)
                                    .toUpperCase()
                                : '',
                            style: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                          )),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Welcome back,',
                        style: TextStyle(
                          fontSize: 14,
                          color: textMediumColor,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Obx(() => Text(
                            controller.name.isNotEmpty
                                ? controller.name.value
                                : '-',
                            style: const TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: textDarkColor,
                            ),
                          )),
                    ],
                  ),
                  const Spacer(),
                  Container(
                    decoration: BoxDecoration(
                      color: cardColor,
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.05),
                          blurRadius: 8,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: IconButton(
                      icon: const Icon(Icons.notifications_outlined,
                          color: primaryColor),
                      onPressed: () {},
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 10),

            // Total Balance Card
            _buildTotalBalanceCard(),
            const SizedBox(height: 24),

            // Quick Actions
            _buildQuickActions(),
            const SizedBox(height: 24),

            // Income & Expense Records Sections
            _buildRecordsSections(),
            const SizedBox(height: 24),

            // Recent Transactions
            _buildRecentTransactions(),
            const SizedBox(height: 60),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: AppTheme.primaryYellow.withOpacity(1.0),
        onPressed: () => Get.toNamed(Routes.CHAT_BOT),
        child: const Icon(Icons.chat_bubble_outline, color: Colors.white),
      ),
    );
  }

  //## Untuk menampilkan card total balance
  Widget _buildTotalBalanceCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [primaryColor, primaryDarkColor],
        ),
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: primaryColor.withOpacity(0.2),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Available Balance',
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.white.withOpacity(0.9),
                    ),
                  ),
                  const SizedBox(height: 4),
                  Obx(
                    () => Text(
                      controller.balance.value,
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ],
              ),
              ElevatedButton(
                onPressed: () => Get.toNamed(Routes.TOPUP),
                style: ElevatedButton.styleFrom(
                  backgroundColor: cardColor,
                  foregroundColor: primaryColor,
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 8,
                  ),
                ),
                child: const Text(
                  'Top Up',
                  style: TextStyle(
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  //## Untuk membuat quick action section
  Widget _buildQuickActions() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Quick Actions',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: textDarkColor,
          ),
        ),
        const SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            _buildQuickActionButton(
              icon: Icons.send,
              label: 'Send',
              onTap: () => Get.toNamed(Routes.TRANSFER),
            ),
            _buildQuickActionButton(
              icon: Icons.account_balance_wallet,
              label: 'Top Up',
              onTap: () => Get.toNamed(Routes.TOPUP),
            ),
            _buildQuickActionButton(
              icon: Icons.history,
              label: 'History',
              onTap: () => Get.toNamed(Routes.HISTORY),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            _buildQuickActionButton(
              icon: Icons.savings,
              label: 'Savings',
              onTap: () => Get.toNamed(Routes.SAVINGS),
            ),
            _buildQuickActionButton(
              icon: Icons.receipt_long,
              label: 'Bills',
              onTap: () => Get.toNamed(Routes.BILLS),
            ),
            _buildQuickActionButton(
              icon: Icons.star,
              label: 'Social',
              onTap: () => Get.toNamed(Routes.FRIEND_PAGE),
            ),
          ],
        ),
      ],
    );
  }

  //## Untuk membuat widget quick action (button)
  Widget _buildQuickActionButton({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 100,
        height: 85,
        decoration: BoxDecoration(
          color: cardColor,
          borderRadius: BorderRadius.circular(14),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.08),
              blurRadius: 8,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: primaryColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(
                icon,
                color: primaryColor,
                size: 22,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              label,
              style: const TextStyle(
                fontSize: 12,
                color: textMediumColor,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  //## Untuk membuat financial records section (income dan expense)
  Widget _buildRecordsSections() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Financial Records',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: textDarkColor,
          ),
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: Obx(() => _buildRecordCard(
                    title: 'Income Records',
                    amount: controller.totalIncome.value,
                    icon: Icons.arrow_downward_rounded,
                    iconColor: const Color(0xFF4CAF50),
                    onTap: () => Get.toNamed(Routes.INCOME),
                  )),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Obx(() => _buildRecordCard(
                    title: 'Expense Records',
                    amount: controller.totalExpense.value,
                    icon: Icons.arrow_upward_rounded,
                    iconColor: const Color(0xFFFF6B6B),
                    onTap: () => Get.toNamed(Routes.EXPENSE),
                  )),
            ),
          ],
        ),
      ],
    );
  }

  //## Untuk membuat widget card untuk financial records
  Widget _buildRecordCard({
    required String title,
    required String amount,
    required IconData icon,
    required Color iconColor,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: cardColor,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 8,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: iconColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(
                    icon,
                    color: iconColor,
                    size: 20,
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    title,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: textDarkColor,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              amount,
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: iconColor,
              ),
            ),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Text(
                  'View Details',
                  style: TextStyle(
                    fontSize: 12,
                    color: primaryColor,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(width: 4),
                const Icon(
                  Icons.arrow_forward_ios,
                  size: 12,
                  color: primaryColor,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  //## Untuk membuat recent transactions section
  Widget _buildRecentTransactions() {
    return Obx(() {
      final transactions = controller.recentTransactions;
      if (transactions.isEmpty) {
        return Center(child: Text('Tidak ada transaksi terbaru.'));
      }
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Recent Transactions',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: textDarkColor,
            ),
          ),
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: controller.recentTransactions.length,
            itemBuilder: (context, index) {
              final data = controller.recentTransactions[index];
              return _buildTransactionItem(
                icon: _getIconForType(data.type),
                title: data.type,
                date: data.date,
                amount: controller.formatCurrency(data.amount),
                isExpense: data.transactionType == 'expense' ? true : false,
              );
            },
          ),
        ],
      );
    });
  }

  //## Fungsi untuk mendapatkan icon berdasarkan tipe transaksi
  IconData _getIconForType(String? type) {
    switch (type) {
      case 'topup':
        return Icons.wallet;
      case 'gift':
        return Icons.card_giftcard;
      default:
        return Icons.receipt_long;
    }
  }

  //## Untuk membuat widget item transaksi
  Widget _buildTransactionItem({
    required IconData icon,
    required String title,
    required String date,
    required String amount,
    required bool isExpense,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: isExpense
                    ? [dangerColor, dangerColor.withOpacity(0.8)]
                    : [successColor, successColor.withOpacity(0.8)],
              ),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(
              icon,
              color: Colors.white,
              size: 20,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: textDarkColor,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  date,
                  style: TextStyle(
                    fontSize: 12,
                    color: textMediumColor.withOpacity(0.8),
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: isExpense
                  ? dangerColor.withOpacity(0.1)
                  : successColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              isExpense ? '-$amount' : '+$amount',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: isExpense ? dangerColor : successColor,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
