import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import 'package:payplus_mobile/app/theme/app_theme.dart';
import '../controllers/chat_screen_controller.dart';

class ChatScreenView extends GetView<ChatScreenController> {
  final String friendPhone;
  final String friendName;

  // Menambahkan konstanta warna yang sama dengan home_view.dart
  static const Color primaryColor = Color(0xFF6C63FF);
  static const Color primaryDarkColor = Color(0xFF4B0082);

  const ChatScreenView({
    Key? key,
    required this.friendPhone,
    required this.friendName,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Pastikan controller diinisialisasi dengan friendPhone
    final controller = Get.put(ChatScreenController(friendPhone));

    return Scaffold(
      appBar: AppBar(
        // Mengubah warna background menjadi solid primaryDarkColor
        backgroundColor: primaryDarkColor,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Get.back(),
        ),
        title: Row(
          children: [
            CircleAvatar(
              backgroundColor: Colors.grey[300],
              child: Text(
                friendName.isNotEmpty ? friendName[0] : '',
                style: TextStyle(color: Colors.black),
              ),
            ),
            SizedBox(width: 10),
            Text(
              friendName,
              style: TextStyle(color: Colors.white),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: Icon(Icons.send_to_mobile, color: Colors.white),
            onPressed: () {},
          ),
        ],
      ),
      body: Container(
        decoration: BoxDecoration(
          image: DecorationImage(
            image: AssetImage('assets/images/logoTab.png'),
            fit: BoxFit.cover,
            colorFilter: ColorFilter.mode(
              Colors.black.withOpacity(0.6),
              BlendMode.darken,
            ),
          ),
        ),
        child: Column(
          children: [
            Expanded(
              child: Obx(() {
                if (controller.isLoading.value) {
                  return Center(child: CircularProgressIndicator());
                }

                if (controller.messages.isEmpty) {
                  return Center(
                    child: Text(
                      'Belum ada pesan',
                      style: TextStyle(color: Colors.white70),
                    ),
                  );
                }

                return ListView.builder(
                  padding: EdgeInsets.symmetric(horizontal: 10, vertical: 15),
                  itemCount: controller.messages.length,
                  itemBuilder: (context, index) {
                    final message = controller.messages[index];
                    // Pastikan pengecekan pengirim dilakukan dengan benar
                    final isSender = message['sender_phone'].toString() ==
                        controller.myPhone.value.toString();

                    // Format tanggal dengan zona waktu Indonesia Barat
                    String formattedTime = '';
                    if (message['sent_at'] != null) {
                      try {
                        final dateTime =
                            DateTime.parse(message['sent_at']).toLocal();
                        formattedTime =
                            DateFormat('HH:mm', 'id_ID').format(dateTime);
                      } catch (e) {
                        formattedTime = '';
                      }
                    }

                    // Cek apakah perlu menampilkan tanggal
                    bool showDate = false;
                    if (index == 0) {
                      showDate = true;
                    } else {
                      final prevMessage = controller.messages[index - 1];
                      if (prevMessage['sent_at'] != null &&
                          message['sent_at'] != null) {
                        try {
                          final prevDate =
                              DateTime.parse(prevMessage['sent_at']).toLocal();
                          final currentDate =
                              DateTime.parse(message['sent_at']).toLocal();

                          if (prevDate.year != currentDate.year ||
                              prevDate.month != currentDate.month ||
                              prevDate.day != currentDate.day) {
                            showDate = true;
                          }
                        } catch (e) {
                          // Abaikan error parsing
                        }
                      }
                    }

                    // Widget untuk menampilkan tanggal
                    Widget dateWidget = SizedBox.shrink();
                    if (showDate && message['sent_at'] != null) {
                      try {
                        final dateTime =
                            DateTime.parse(message['sent_at']).toLocal();
                        final formattedDate =
                            DateFormat('d MMMM yyyy', 'id_ID').format(dateTime);

                        dateWidget = Center(
                          child: Container(
                            margin: EdgeInsets.symmetric(vertical: 10),
                            padding: EdgeInsets.symmetric(
                                horizontal: 12, vertical: 6),
                            decoration: BoxDecoration(
                              color: Colors.black54,
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Text(
                              formattedDate,
                              style:
                                  TextStyle(color: Colors.white, fontSize: 12),
                            ),
                          ),
                        );
                      } catch (e) {
                        // Abaikan error parsing
                      }
                    }

                    return Column(
                      children: [
                        dateWidget,
                        Align(
                          alignment: isSender
                              ? Alignment.centerRight
                              : Alignment.centerLeft,
                          child: Container(
                            margin: EdgeInsets.only(
                              bottom: 8,
                              left: isSender ? 50 : 0,
                              right: isSender ? 0 : 50,
                            ),
                            padding: EdgeInsets.symmetric(
                                horizontal: 12, vertical: 8),
                            decoration: BoxDecoration(
                              // Mengubah warna pesan pengirim menjadi primaryColor
                              color: isSender ? primaryColor : Colors.grey[700],
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.end,
                              children: [
                                Text(
                                  message['message'] ?? '',
                                  style: TextStyle(
                                      color: Colors.white, fontSize: 16),
                                ),
                                SizedBox(height: 2),
                                Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Text(
                                      formattedTime,
                                      style: TextStyle(
                                          color: Colors.white70, fontSize: 11),
                                    ),
                                    // Hapus tanda centang biru
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    );
                  },
                );
              }),
            ),
            Container(
              padding: EdgeInsets.symmetric(horizontal: 8, vertical: 8),
              // Mengubah warna background menjadi solid primaryDarkColor
              color: primaryDarkColor,
              child: Row(
                children: [
                  // Hapus IconButton emoji_emotions
                  Expanded(
                    child: Container(
                      padding: EdgeInsets.symmetric(horizontal: 16),
                      decoration: BoxDecoration(
                        color: Colors.grey[800],
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: TextField(
                        controller: controller.messageController,
                        style: TextStyle(color: Colors.white),
                        decoration: InputDecoration(
                          hintText: 'Ketik pesan...',
                          hintStyle: TextStyle(color: Colors.grey[400]),
                          border: InputBorder.none,
                        ),
                      ),
                    ),
                  ),
                  SizedBox(width: 8),
                  Container(
                    child: FloatingActionButton(
                      mini: true,
                      backgroundColor: AppTheme.textDark,
                      child: Icon(Icons.send, color: Colors.white),
                      onPressed: () => controller.sendMessage(),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
