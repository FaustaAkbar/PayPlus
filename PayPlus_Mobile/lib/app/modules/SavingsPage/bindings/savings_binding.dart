import 'package:get/get.dart';
import 'package:payplus_mobile/app/modules/SavingsPage/controllers/savings_controller.dart';

class SavingsBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<SavingsController>(
      () => SavingsController(),
    );
  }
}
