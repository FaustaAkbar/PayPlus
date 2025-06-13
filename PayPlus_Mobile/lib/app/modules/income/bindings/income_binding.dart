import 'package:get/get.dart';
import 'package:payplus_mobile/app/modules/income/controllers/income_controller.dart';

class IncomeBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<IncomeController>(
      () => IncomeController(),
    );
  }
}
