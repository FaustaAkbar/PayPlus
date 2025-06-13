import 'package:get/get.dart';
import '../controllers/signup_page_controller.dart';

class SignupBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<SignupPageController>(
      () => SignupPageController(),
    );
  }
}
