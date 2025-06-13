import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:payplus_mobile/services/api_service.dart';

class FriendPageController extends GetxController {
  final searchController = TextEditingController();
  final friends = [].obs;
  final friendRequests = [].obs;
  final searchResults = [].obs;
  final isLoading = false.obs;
  final isLoadingRequests = false.obs;
  final isSearching = false.obs;
  final errorMessage = ''.obs; // Menambahkan properti errorMessage sebagai Rx

  @override
  void onInit() {
    super.onInit();
    fetchFriends();
    fetchFriendRequests();
  }

  @override
  void onClose() {
    searchController.dispose();
    super.onClose();
  }

  // Fetch friends list
  Future<void> fetchFriends() async {
    isLoading.value = true;
    errorMessage.value = ''; // Reset error message
    final result = await ApiService.getFriends();
    isLoading.value = false;

    if (result['success']) {
      friends.value = result['data']['friends'] ?? [];
    } else {
      errorMessage.value = result['message'] ??
          'Terjadi kesalahan saat mengambil data teman'; // Set error message
      Get.snackbar(
        'Error',
        result['message'],
        backgroundColor: Colors.red.withOpacity(0.7),
        colorText: Colors.white,
      );
    }
  }

  // Add friend
  Future<bool> addFriend(String phone) async {
    isLoading.value = true;
    final result = await ApiService.addFriend(phone);
    isLoading.value = false;

    if (result['success']) {
      fetchFriends(); // Refresh the friends list
      fetchFriendRequests(); // Tambahkan ini untuk refresh permintaan pertemanan juga
      return true;
    } else {
      Get.snackbar(
        'Error',
        result['message'],
        backgroundColor: Colors.red.withOpacity(0.7),
        colorText: Colors.white,
      );
      return false;
    }
  }

  // Fetch friend requests
  Future<void> fetchFriendRequests() async {
    isLoadingRequests.value = true;
    final result = await ApiService.getFriendRequests();
    isLoadingRequests.value = false;

    if (result['success']) {
      // Periksa struktur data yang benar
      print(
          "Friend Requests Response: ${result['data']}"); // Tambahkan log untuk debugging

      // Coba akses data dengan beberapa kemungkinan struktur
      if (result['data'] != null) {
        if (result['data']['data'] != null) {
          friendRequests.value = result['data']['data'];
        } else if (result['data']['requests'] != null) {
          friendRequests.value = result['data']['requests'];
        } else if (result['data'] is List) {
          friendRequests.value = result['data'];
        } else {
          // Jika tidak ada struktur yang cocok, coba ambil kunci pertama yang berisi array
          final dataMap = result['data'];
          if (dataMap is Map) {
            for (var key in dataMap.keys) {
              if (dataMap[key] is List) {
                friendRequests.value = dataMap[key];
                break;
              }
            }
          }
        }
      }

      print(
          "Friend Requests Parsed: ${friendRequests.length}"); // Log jumlah permintaan yang diproses
    } else {
      Get.snackbar(
        'Error',
        result['message'],
        backgroundColor: Colors.red.withOpacity(0.7),
        colorText: Colors.white,
      );
    }
  }

  // Respond to friend request
  Future<bool> respondToFriendRequest(String requestId, String action) async {
    final result = await ApiService.respondToFriendRequest(requestId, action);

    if (result['success']) {
      // Refresh friend requests and friends list
      fetchFriendRequests();
      fetchFriends();

      Get.snackbar(
        'Berhasil',
        result['message'],
        backgroundColor: Colors.green.withOpacity(0.7),
        colorText: Colors.white,
      );
      return true;
    } else {
      Get.snackbar(
        'Error',
        result['message'],
        backgroundColor: Colors.red.withOpacity(0.7),
        colorText: Colors.white,
      );
      return false;
    }
  }

  // Delete friend
  Future<void> deleteFriend(String friendPhone) async {
    // Ganti friendId menjadi friendPhone
    isLoading.value = true;
    final result =
        await ApiService.deleteFriend(friendPhone); // Kirim friendPhone ke API
    isLoading.value = false;

    if (result['success']) {
      // Hapus teman dari daftar
      friends.removeWhere((friend) =>
          friend['phone'].toString() == friendPhone); // Cek berdasarkan phone
      Get.snackbar(
        'Sukses',
        'Teman berhasil dihapus',
        backgroundColor: Colors.green.withOpacity(0.7),
        colorText: Colors.white,
      );
    } else {
      // Tambahkan pesan error ke errorMessage
      errorMessage.value = result['message'] ?? 'Gagal menghapus teman';

      // Jika error karena teman tidak ditemukan, refresh daftar teman
      if (result['message']
              ?.toString()
              .toLowerCase()
              .contains('tidak ditemukan') ??
          false) {
        fetchFriends();
      }

      Get.snackbar(
        'Error',
        result['message'] ?? 'Gagal menghapus teman',
        backgroundColor: Colors.red.withOpacity(0.7),
        colorText: Colors.white,
      );
    }
  }
}
