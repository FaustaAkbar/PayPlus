import 'package:get/get.dart';
import '../controllers/chat_screen_controller.dart';

class ChatScreenBinding extends Bindings {
  @override
  void dependencies() {
    // Binding ChatScreenController
    Get.lazyPut(() => ChatScreenController(Get.arguments));
  }
}
