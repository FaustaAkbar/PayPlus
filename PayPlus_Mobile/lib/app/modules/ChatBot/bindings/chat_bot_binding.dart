import 'package:get/get.dart';

import '../controllers/chat_bot_controller.dart';

class ChatBotBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<ChatBotController>(
      () => ChatBotController(),
    );
  }
}
