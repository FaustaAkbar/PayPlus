import 'package:get/get.dart';

import '../controllers/add_friend_dialog_controller.dart';

class AddFriendDialogBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<AddFriendDialogController>(
      () => AddFriendDialogController(),
    );
  }
}
