import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:payplus_mobile/services/api_service.dart';

class ChatMessage {
  final String text;
  final bool isUser;
  final DateTime timestamp;

  ChatMessage({
    required this.text,
    required this.isUser,
    DateTime? timestamp,
  }) : timestamp = timestamp ?? DateTime.now();
}

class ChatBotController extends GetxController {
  final chatMessages = <ChatMessage>[].obs;
  final TextEditingController messageController = TextEditingController();
  final isLoading = false.obs;

  @override
  void onInit() {
    super.onInit();
    // Menambahkan pesan selamat datang dari bot
    chatMessages.add(
      ChatMessage(
        text: 'Halo! Saya adalah PayPlus Assistant. Ada yang bisa saya bantu tentang keuangan Anda?',
        isUser: false,
      ),
    );
  }

  Future<void> sendMessage() async {
    final text = messageController.text.trim();
    if (text.isEmpty) return;

    // Menambahkan pesan pengguna
    chatMessages.add(
      ChatMessage(
        text: text,
        isUser: true,
      ),
    );
    
    messageController.clear();
    isLoading.value = true;

    try {
      // Panggil API chatbot
      final result = await ApiService.sendChatbotMessage(text);
      
      if (result['success']) {
        chatMessages.add(
          ChatMessage(
            text: result['response'],
            isUser: false,
          ),
        );
      } else {
        chatMessages.add(
          ChatMessage(
            text: 'Maaf, saya mengalami kesulitan untuk menjawab saat ini. Silakan coba lagi nanti.',
            isUser: false,
          ),
        );
      }
    } catch (e) {
      chatMessages.add(
        ChatMessage(
          text: 'Terjadi kesalahan. Silakan periksa koneksi internet Anda dan coba lagi.',
          isUser: false,
        ),
      );
    } finally {
      isLoading.value = false;
    }
  }

  @override
  void onClose() {
    messageController.dispose();
    super.onClose();
  }
}
