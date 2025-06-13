import 'package:get/get.dart';
import '../controllers/bill_controller.dart';

class BillBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<BillController>(
      () => BillController(),
    );
  }
}