import 'package:get/get.dart';
import 'package:payplus_mobile/app/modules/TopUpAmountPage/controllers/topupamount_controller.dart';

class TopUpAmountBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<TopUpAmountController>(
      () => TopUpAmountController(),
    );
  }
}
