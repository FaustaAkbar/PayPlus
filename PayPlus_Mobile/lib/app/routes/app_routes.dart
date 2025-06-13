part of 'app_pages.dart';

abstract class Routes {
  Routes._();
  static const HOME = _Paths.HOME;
  static const BILLS = _Paths.BILLS;
  static const EDIT_BILL = _Paths.EDIT_BILL;
  static const SETTING = _Paths.SETTING;
  static const INCOME = _Paths.INCOME;
  static const EXPENSE = _Paths.EXPENSE;
  static const LOGIN = _Paths.LOGIN;
  static const SIGNUP = _Paths.SIGNUP;
  static const TRANSFER = _Paths.TRANSFER;
  static const TES = _Paths.TES;
  static const SAVINGS = _Paths.SAVINGS;
  static const FRIEND_PAGE = _Paths.FRIEND_PAGE;
  static const CHAT = _Paths.CHAT;
  static const CHAT_LIST = _Paths.CHAT_LIST;
  static const CHAT_BOT = _Paths.CHAT_BOT;
  static const TOPUP = _Paths.TOPUP;
  static const TOPUPAMOUNT = _Paths.TOPUPAMOUNT;
  static const ADD_FRIEND_DIALOG = _Paths.ADD_FRIEND_DIALOG;
  static const HISTORY = _Paths.HISTORY;
  static const CHAT_SCREEN = _Paths.CHAT_SCREEN;
}

abstract class _Paths {
  _Paths._();
  static const HOME = '/home';
  static const BILLS = '/bills';
  static const EDIT_BILL = '/edit-bill';
  static const SETTING = '/setting';
  static const INCOME = '/income';
  static const EXPENSE = '/expense';
  static const LOGIN = '/login';
  static const SIGNUP = '/signup';
  static const TRANSFER = '/transfer';
  static const TES = '/tes';
  static const SAVINGS = '/savings';
  static const FRIEND_PAGE = '/friend-page';
  static const CHAT = '/chat';
  static const CHAT_LIST = '/chat-list';
  static const CHAT_BOT = '/chat-bot';
  static const TOPUP = '/topup';
  static const TOPUPAMOUNT = '/topupamount';
  static const ADD_FRIEND_DIALOG = '/add-friend-dialog';
  static const HISTORY = '/history';
  static const CHAT_SCREEN = '/chat-screen';
}
