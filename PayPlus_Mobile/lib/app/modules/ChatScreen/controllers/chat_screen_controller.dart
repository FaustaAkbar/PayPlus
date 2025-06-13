import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:payplus_mobile/services/api_service.dart';
import 'package:web_socket_channel/web_socket_channel.dart';

class ChatScreenController extends GetxController {
  final String friendPhone;
  RxList<Map<String, dynamic>> messages = <Map<String, dynamic>>[].obs;
  RxBool isLoading = false.obs;
  TextEditingController messageController = TextEditingController();
  RxString myPhone = "".obs;

  ChatScreenController(this.friendPhone);

  late WebSocketChannel channel;

  @override
  void onInit() {
    super.onInit();
    getUserPhone();
    fetchMessages();
    connectToWebSocket();
  }

  // ambil nomor telepon
  Future<void> getUserPhone() async {
    final result = await ApiService.getProfile();
    if (result['success'] == true && result['data'] != null) {
      myPhone.value = result['data']['phone']?.toString() ?? "";
    }
  }

  // Fungsi untuk menghubungkan ke WebSocket
  void connectToWebSocket() {
    channel = WebSocketChannel.connect(
      Uri.parse('ws://10.0.2.2:3000'),
    );

    // Menerima pesan dari WebSocket
    channel.stream.listen(
      (message) {
        final decodedMessage = jsonDecode(message);
        messages.add(decodedMessage); // Menambahkan pesan baru ke list
      },
      onDone: () {
        fetchMessages();
      },
      onError: (error) {
        print('WebSocket error: $error');
      },
    );
  }

  Future<void> fetchMessages() async {
    isLoading.value = true;
    final result = await ApiService.getMessages(friendPhone);
    isLoading.value = false;

    if (result['success'] == true) {
      if (result['messages'] is List) {
        messages.value = List<Map<String, dynamic>>.from(result['messages']);
      } else {
        Get.snackbar('Error', 'Format pesan tidak valid');
      }
    } else {
      Get.snackbar('Error', result['message'] ?? 'Pesan tidak ditemukan');
    }
  }

  // Fungsi untuk mengirim pesan
  Future<void> sendMessage() async {
    final message = messageController.text;
    if (message.isEmpty) return;

    final messageData = {
      'sender_phone': myPhone.value,
      'receiver_phone': friendPhone,
      'message': message,
      'sent_at': DateTime.now().toIso8601String()
    };

    // Kirim pesan ke WebSocket
    channel.sink.add(jsonEncode(messageData));

    // Simpan pesan ke backend
    final result = await ApiService.sendMessage(friendPhone, message);

    if (result['success'] == true) {
      messages.add(messageData);

      messageController.clear();
    } else {
      Get.snackbar('Gagal', result['message'] ?? 'Gagal mengirim pesan');
    }
  }

  @override
  void onClose() {
    super.onClose();
    channel.sink.close();
  }
}
