import 'package:get/get.dart';
import '../controllers/transfer_page_controller.dart';

class TransferBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<TransferPageController>(
      () => TransferPageController(),
    );
  }
}
