import 'package:get/get.dart';
import 'package:payplus_mobile/app/modules/TopUpPage/controllers/topup_controller.dart';

class TopUpBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<TopUpController>(
      () => TopUpController(),
    );
  }
}
