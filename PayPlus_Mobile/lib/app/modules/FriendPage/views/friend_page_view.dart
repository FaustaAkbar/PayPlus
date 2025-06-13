import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:payplus_mobile/app/modules/ChatScreen/views/chat_screen_view.dart';
import 'package:payplus_mobile/app/modules/FriendPage/views/friend_request_widget.dart';
import 'package:payplus_mobile/app/modules/add_friend_dialog/views/add_friend_dialog_view.dart';
import '../controllers/friend_page_controller.dart';
import '../../../theme/app_theme.dart';

class FriendPageView extends StatelessWidget {
  const FriendPageView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(FriendPageController());

    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: Text(
          'PayPlus Friend',
          style: AppTheme.headingStyle.copyWith(color: AppTheme.primaryPurple),
        ),
        backgroundColor: AppTheme.background,
        elevation: 0,
        actions: [
          IconButton(
            icon: Icon(Icons.add, color: AppTheme.primaryPurple),
            onPressed: () => Get.dialog(AddFriendDialog()),
          ),
          SizedBox(
            height: 50,
          )
        ],
        bottom: PreferredSize(
          preferredSize: Size.fromHeight(2.0),
          child: Divider(
            color: AppTheme.primaryPurple.withOpacity(0.2),
            thickness: 1.0,
            height: 1.0,
          ),
        ),
      ),

      body: Stack(
        children: [
          Column(
            children: [
              SizedBox(height: 16),

              // Friend list
              Expanded(
                child: Obx(() {
                  if (controller.isLoading.value) {
                    return Center(
                      child: CircularProgressIndicator(
                        color: AppTheme.primaryPurple,
                      ),
                    );
                  }

                  if (controller.errorMessage.value.isNotEmpty) {
                    return Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.error_outline,
                              color: Colors.red, size: 48),
                          SizedBox(height: 16),
                          Text(
                            controller.errorMessage.value,
                            style: TextStyle(color: Colors.red),
                            textAlign: TextAlign.center,
                          ),
                          SizedBox(height: 16),
                          ElevatedButton(
                            onPressed: controller.fetchFriends,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppTheme.primaryPurple,
                            ),
                            child: Text('Coba Lagi'),
                          ),
                        ],
                      ),
                    );
                  }

                  if (controller.friends.isEmpty) {
                    return Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.people_outline,
                            color: AppTheme.coinYellow,
                            size: 64,
                          ),
                          SizedBox(height: 16),
                          Text(
                            'Belum ada teman',
                            style: TextStyle(
                              color: AppTheme.textDark,
                              fontWeight: FontWeight.bold,
                              fontSize: 23,
                            ),
                          ),
                          SizedBox(height: 16),
                          ElevatedButton(
                              onPressed: () => Get.dialog(AddFriendDialog()),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Color(0xFF6C63FF),
                              ),
                              child: Text(
                                'Tambah Teman',
                                style: TextStyle(
                                  color: Colors.white,
                                ),
                              )),
                        ],
                      ),
                    );
                  }

                  return ListView.builder(
                    // Ubah padding untuk memberikan jarak lebih
                    padding: const EdgeInsets.symmetric(
                        horizontal: 16, vertical: 12),
                    itemCount: controller.friends.length,
                    itemBuilder: (context, index) {
                      final friend = controller.friends[index];
                      return Dismissible(
                        key: Key(friend['id']?.toString() ?? index.toString()),
                        // Hapus background untuk geser kiri (edit)
                        background: Container(
                          color: Colors.transparent,
                        ),
                        secondaryBackground: Container(
                          alignment: Alignment.centerRight,
                          padding: const EdgeInsets.only(right: 20),
                          decoration: BoxDecoration(
                            color: Colors.red,
                            borderRadius:
                                BorderRadius.circular(AppTheme.borderRadius),
                          ),
                          child: const Icon(
                            Icons.delete,
                            color: Colors.white,
                          ),
                        ),
                        // Hanya izinkan geser ke kanan untuk hapus
                        direction: DismissDirection.endToStart,
                        confirmDismiss: (direction) async {
                          if (direction == DismissDirection.endToStart) {
                            // Delete action
                            return await _showDeleteConfirmationDialog(
                                context, friend);
                          }

                          return false;
                        },
                        onDismissed: (direction) {
                          if (direction == DismissDirection.endToStart) {
                            // Delete action already handled in confirmDismiss
                          }
                        },
                        child: Container(
                          // Tambahkan margin untuk memberikan jarak antar item
                          margin: const EdgeInsets.only(bottom: 16),
                          decoration: AppTheme.cardDecoration,
                          child: ListTile(
                            // Tambahkan padding dalam ListTile untuk memberikan ruang lebih
                            contentPadding: const EdgeInsets.symmetric(
                                horizontal: 20, vertical: 12),
                            leading: CircleAvatar(
                              radius: 24,
                              backgroundColor:
                                  AppTheme.primaryYellow.withOpacity(0.3),
                              child: Text(
                                _getInitials(friend['name'] ?? ''),
                                style: TextStyle(
                                  color: AppTheme.primaryPurple,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 18,
                                ),
                              ),
                            ),
                            title: Text(
                              friend['name'] ?? 'Tidak ada nama',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: AppTheme.textDark,
                              ),
                            ),
                            subtitle: Text(
                              'Phone: ${friend['phone'] ?? 'Tidak ada nomor'}',
                              style: TextStyle(
                                color: AppTheme.textLight,
                              ),
                            ),
                            trailing: IconButton(
                              icon: Icon(Icons.chat_bubble), // Ikon chat
                              onPressed: () {
                                // Arahkan ke UI obrolan dengan teman ini
                                Get.to(() => ChatScreenView(
                                      friendPhone:
                                          friend['phone']?.toString() ?? '',
                                      friendName: friend['name'] ?? '',
                                    ));
                              },
                            ),
                          ),
                        ),
                      );
                    },
                  );
                }),
              ),
            ],
          ),
        ],
      ),
      // friend request button
      floatingActionButton: Obx(() => FloatingActionButton(
            backgroundColor: Color(0xFF6C63FF),
            onPressed: () {
              Get.dialog(
                Dialog(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  insetPadding: EdgeInsets.all(16),
                  backgroundColor: Colors.white,
                  child: Container(
                    constraints: BoxConstraints(
                      maxHeight: MediaQuery.of(context).size.height * 0.6,
                    ),
                    padding: EdgeInsets.all(16),
                    child: FriendRequestWidget(controller: controller),
                  ),
                ),
                barrierDismissible: true,
              );
            },
            child: Stack(
              alignment: Alignment.center,
              children: [
                Icon(Icons.group_add, size: 28, color: Colors.white),
                if (controller.friendRequests.isNotEmpty)
                  Positioned(
                    top: 6,
                    right: 6,
                    child: Container(
                      width: 10,
                      height: 10,
                      decoration: BoxDecoration(
                        color: Colors.red,
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
              ],
            ),
          )),
    );
  }

  // Dialog untuk konfirmasi hapus teman
  Future<bool> _showDeleteConfirmationDialog(
      BuildContext context, Map<String, dynamic> friend) async {
    return await showDialog<bool>(
          context: context,
          builder: (BuildContext context) {
            return AlertDialog(
              title: Text('Hapus Teman'),
              content: Text(
                  'Apakah Anda yakin ingin menghapus ${friend['name']} dari daftar teman?'),
              actions: <Widget>[
                TextButton(
                  onPressed: () => Navigator.of(context).pop(false),
                  child: Text('Batal'),
                ),
                TextButton(
                  onPressed: () {
                    final controller = Get.find<FriendPageController>();
                    controller.deleteFriend(friend['phone'].toString());
                    Navigator.of(context).pop(true);
                  },
                  style: TextButton.styleFrom(
                    foregroundColor: Colors.red,
                  ),
                  child: Text('Hapus'),
                ),
              ],
            );
          },
        ) ??
        false;
  }

  String _getInitials(String name) {
    if (name.isEmpty) return '';
    final nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return nameParts[0][0] + nameParts[1][0];
    } else if (name.length > 1) {
      return name.substring(0, 2);
    } else {
      return name;
    }
  }
}
