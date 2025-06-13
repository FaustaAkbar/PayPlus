import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:payplus_mobile/app/modules/FriendPage/controllers/friend_page_controller.dart';
import 'package:payplus_mobile/app/theme/app_theme.dart';

class AddFriendDialog extends StatelessWidget {
  AddFriendDialog({Key? key}) : super(key: key);

  final phoneController = TextEditingController();
  final FriendPageController friendController =
      Get.find<FriendPageController>();

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppTheme.borderRadius),
      ),
      elevation: 0,
      backgroundColor: Colors.transparent,
      child: contentBox(context),
    );
  }

  Widget contentBox(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        shape: BoxShape.rectangle,
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppTheme.borderRadius),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            'Tambah Teman',
            style: AppTheme.headingStyle.copyWith(
              fontSize: 18,
              color: AppTheme.primaryPurple,
            ),
          ),
          const SizedBox(height: 20),
          TextField(
            controller: phoneController,
            keyboardType: TextInputType.phone,
            decoration: InputDecoration(
              hintText: 'Masukkan nomor telepon',
              prefixIcon: Icon(
                Icons.phone,
                color: AppTheme.primaryPurple,
              ),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(AppTheme.borderRadius),
                borderSide: BorderSide(
                  color: AppTheme.primaryPurple.withOpacity(0.3),
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(AppTheme.borderRadius),
                borderSide: BorderSide(
                  color: AppTheme.primaryPurple,
                ),
              ),
            ),
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              TextButton(
                onPressed: () => Get.back(),
                child: Text(
                  'Batal',
                  style: TextStyle(
                    color: AppTheme.primaryPurple.withOpacity(0.7),
                  ),
                ),
              ),
              ElevatedButton(
                onPressed: () async {
                  if (phoneController.text.isEmpty) {
                    Get.snackbar(
                      'Error',
                      'Nomor telepon tidak boleh kosong',
                      backgroundColor: Colors.red.withOpacity(0.7),
                      colorText: Colors.white,
                    );
                    return;
                  }

                  final success =
                      await friendController.addFriend(phoneController.text);

                  if (success) {
                    Get.back();
                    Get.snackbar(
                      'Berhasil',
                      'Permintaan pertemanan berhasil dikirim',
                      backgroundColor: Colors.green.withOpacity(0.7),
                      colorText: Colors.white,
                    );
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryPurple,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(AppTheme.borderRadius),
                  ),
                ),
                child: const Text(
                  'Tambah',
                  style: TextStyle(color: Colors.white),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
