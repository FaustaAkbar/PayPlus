import 'package:get/get.dart';
import '../modules/ChatBot/bindings/chat_bot_binding.dart';
import '../modules/ChatBot/views/chat_bot_view.dart';
import '../modules/ChatScreen/bindings/chat_screen_binding.dart';
import '../modules/ChatScreen/views/chat_screen_view.dart';
import '../modules/FriendPage/bindings/friend_page_binding.dart';
import '../modules/FriendPage/views/friend_page_view.dart';
import '../modules/LoginPage/bindings/login_page_binding.dart';
import '../modules/LoginPage/views/login_page_view.dart';
import '../modules/SavingsPage/bindings/savings_binding.dart';
import '../modules/SavingsPage/views/savings_page.dart';
import '../modules/SignupPage/bindings/signup_page_binding.dart';
import '../modules/SignupPage/views/signup_page_view.dart';
import '../modules/TopUpAmountPage/bindings/topupamount_binding.dart';
import '../modules/TopUpAmountPage/views/topupamount_page.dart';
import '../modules/TopUpPage/bindings/topup_binding.dart';
import '../modules/TopUpPage/views/topup_page.dart';
import '../modules/TransferPage/bindings/transfer_page_binding.dart';
import '../modules/TransferPage/views/transfer_page_view.dart';
import '../modules/bills/bindings/bill_binding.dart';
import '../modules/bills/views/bill_view.dart';
import '../modules/bills/views/edit_bill_view.dart';
import '../modules/expense/bindings/expense_binding.dart';
import '../modules/expense/views/expense_view.dart';
import '../modules/history/bindings/history_binding.dart';
import '../modules/history/views/history_view.dart';
import '../modules/home/bindings/home_binding.dart';
import '../modules/home/views/home_view.dart';
import '../modules/income/bindings/income_binding.dart';
import '../modules/income/views/income_view.dart';
import '../modules/setting/bindings/setting_binding.dart';
import '../modules/setting/views/setting_view.dart';

part 'app_routes.dart';

class AppPages {
  AppPages._();

  static const INITIAL = Routes.LOGIN;
  static final routes = [
    GetPage(
      name: _Paths.HOME,
      page: () => const HomeView(),
      binding: HomeBinding(),
    ),
    GetPage(
      name: _Paths.BILLS,
      page: () => const BillView(),
      binding: BillBinding(),
    ),
    GetPage(
      name: _Paths.EDIT_BILL,
      page: () => const EditBillView(),
      binding: BillBinding(),
    ),
    GetPage(
      name: _Paths.SETTING,
      page: () => const SettingView(),
      binding: SettingBinding(),
    ),
    GetPage(
      name: _Paths.INCOME,
      page: () => const IncomeView(),
      binding: IncomeBinding(),
    ),
    GetPage(
      name: _Paths.EXPENSE,
      page: () => const ExpenseView(),
      binding: ExpenseBinding(),
    ),
    GetPage(
      name: _Paths.LOGIN,
      page: () => const LoginView(),
      binding: LoginBinding(),
    ),
    GetPage(
      name: _Paths.SIGNUP,
      page: () => const SignupView(),
      binding: SignupBinding(),
    ),
    GetPage(
      name: _Paths.TRANSFER,
      page: () => const TransferView(),
      binding: TransferBinding(),
    ),
    GetPage(
      name: _Paths.SAVINGS,
      page: () => const SavingsPage(),
      binding: SavingsBinding(),
    ),
    GetPage(
      name: _Paths.FRIEND_PAGE,
      page: () => const FriendPageView(),
      binding: FriendPageBinding(),
    ),
    GetPage(
      name: _Paths.CHAT_BOT,
      page: () => const ChatBotView(),
      binding: ChatBotBinding(),
    ),
    GetPage(
      name: _Paths.TOPUP,
      page: () => const TopUpPage(),
      binding: TopUpBinding(),
    ),
    GetPage(
      name: _Paths.TOPUPAMOUNT,
      page: () => const TopUpAmountPage(),
      binding: TopUpAmountBinding(),
    ),
    GetPage(
      name: _Paths.HISTORY,
      page: () => const HistoryView(),
      binding: HistoryBinding(),
    ),
    GetPage(
      name: _Paths.CHAT_SCREEN,
      page: () => ChatScreenView(
          friendName: Get.arguments['friendName'],
          friendPhone: Get.arguments['friendPhone']),
      binding: ChatScreenBinding(),
    ),
  ];
}
