import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/bill_controller.dart';
import '../../../models/bill_model.dart';

class EditBillView extends GetView<BillController> {
  const EditBillView({super.key});

  @override
  Widget build(BuildContext context) {
    final Bill bill = Get.arguments as Bill;

    // Populate the form with the bill data
    WidgetsBinding.instance.addPostFrameCallback((_) {
      controller.populateFormForEdit(bill);
    });

    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Bill', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.grey.withOpacity(0.1),
                  spreadRadius: 1,
                  blurRadius: 5,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Edit Bill Details',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.deepPurple,
                  ),
                ),
                const SizedBox(height: 20),
                TextField(
                  controller: controller.nameController,
                  decoration: InputDecoration(
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                    labelText: 'Bill Name',
                    prefixIcon: const Icon(Icons.description, color: Colors.deepPurple),
                    filled: true,
                    fillColor: Colors.grey.shade50,
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: const BorderSide(color: Colors.deepPurple, width: 2),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: controller.amountController,
                  keyboardType: TextInputType.number,
                  decoration: InputDecoration(
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                    labelText: 'Amount',
                    prefixIcon: const Icon(Icons.money, color: Colors.deepPurple),
                    filled: true,
                    fillColor: Colors.grey.shade50,
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: const BorderSide(color: Colors.deepPurple, width: 2),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: controller.dateController,
                  readOnly: true,
                  decoration: InputDecoration(
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                    labelText: 'Due Date',
                    prefixIcon: const Icon(Icons.calendar_today, color: Colors.deepPurple),
                    filled: true,
                    fillColor: Colors.grey.shade50,
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: const BorderSide(color: Colors.deepPurple, width: 2),
                    ),
                  ),
                  onTap: () async {
                    final pickedDate = await showDatePicker(
                      context: Get.context!,
                      initialDate: controller.selectedDate.value ?? bill.dueDate,
                      firstDate: DateTime(2020),
                      lastDate: DateTime(2030),
                      builder: (context, child) {
                        return Theme(
                          data: Theme.of(context).copyWith(
                            colorScheme: ColorScheme.light(
                              primary: Colors.deepPurple.shade400,
                              onPrimary: Colors.white,
                              onSurface: Colors.black,
                            ),
                          ),
                          child: child!,
                        );
                      },
                    );

                    if (pickedDate != null) {
                      controller.setSelectedDate(pickedDate);
                    }
                  },
                ),
                const SizedBox(height: 16),
                Obx(() => DropdownButtonFormField<String>(
                      value: controller.selectedCategory.value,
                      decoration: InputDecoration(
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                        labelText: 'Category',
                        prefixIcon: const Icon(Icons.category, color: Colors.deepPurple),
                        filled: true,
                        fillColor: Colors.grey.shade50,
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(10),
                          borderSide: const BorderSide(color: Colors.deepPurple, width: 2),
                        ),
                      ),
                      items: controller.categories.map((category) {
                        return DropdownMenuItem(
                          value: category,
                          child: Text(category),
                        );
                      }).toList(),
                      onChanged: (value) {
                        if (value != null) {
                          controller.selectedCategory.value = value;
                        }
                      },
                    )),
                const SizedBox(height: 30),
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton.icon(
                        icon: const Icon(Icons.cancel, color: Colors.white),
                        label: const Text('Cancel', style: TextStyle(color: Colors.white)),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.grey,
                          padding: const EdgeInsets.symmetric(vertical: 15),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                        ),
                        onPressed: () {
                          Get.back();
                        },
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: ElevatedButton.icon(
                        icon: const Icon(Icons.save, color: Colors.white),
                        label: const Text('Save Changes', style: TextStyle(color: Colors.white)),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.deepPurple,
                          padding: const EdgeInsets.symmetric(vertical: 15),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                        ),
                        onPressed: () {
                          try {
                            // Call the edit bill method
                            controller.editBill(
                              bill.id,
                              controller.nameController.text,
                              double.parse(controller.amountController.text),
                              controller.selectedDate.value!,
                              controller.selectedCategory.value,
                            );

                            // Clear the form after successful edit
                            controller.clearForm();

                            // Show success message
                            Get.snackbar(
                              'Success',
                              'Bill updated successfully',
                              backgroundColor: Colors.green.shade100,
                              colorText: Colors.green.shade900,
                              icon: const Icon(Icons.check_circle, color: Colors.green),
                              snackPosition: SnackPosition.TOP,
                            );

                            // Navigate back to bills page
                            Get.offNamed('/bills');
                          } catch (e) {
                            // Show error message if something goes wrong
                            Get.snackbar(
                              'Error',
                              'Failed to update bill: ${e.toString()}',
                              backgroundColor: Colors.red.shade100,
                              colorText: Colors.red.shade900,
                              icon: const Icon(Icons.error, color: Colors.red),
                              snackPosition: SnackPosition.TOP,
                            );
                          }
                        },
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
