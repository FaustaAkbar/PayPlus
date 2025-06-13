import 'package:get/get.dart';

import '../controllers/friend_page_controller.dart';

class FriendPageBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<FriendPageController>(
      () => FriendPageController(),
    );
  }
}
