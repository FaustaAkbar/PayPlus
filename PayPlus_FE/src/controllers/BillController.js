import BillModel from '../models/BillModel';

class BillController {
  static async fetchBills(setLoading, setBills, setError, setNotifications, setTotalBillAmount, setBillsByCategory) {
    try {
      setLoading(true);
      const response = await BillModel.getBills();
      
      if (response.success && response.data && response.data.bills) {
        const sortedBills = response.data.bills.sort((a, b) => {
          return new Date(a.dueDate) - new Date(b.dueDate);
        });
        
        setBills(sortedBills);
        
        const notifications = this.checkBillsStatus(sortedBills);
        setNotifications(notifications);
        
        const total = this.calculateTotalBillAmount(sortedBills);
        setTotalBillAmount(total);
        
        const byCategory = this.groupBillsByCategory(sortedBills);
        setBillsByCategory(byCategory);
      } else {
        setError(response.message || "Gagal memuat data tagihan");
      }
    } catch (err) {
      setError("Terjadi kesalahan yang tidak terduga");
      console.error("Error fetching bills:", err);
    } finally {
      setLoading(false);
    }
  }

  static async addBill(newBill, setLoading, setError, setSuccessMessage, resetForm, closeForm, refreshBills) {
    try {
      setLoading(true);
      
      if (!newBill.name || !newBill.amount || !newBill.dueDate || !newBill.category) {
        setError("All fields must be filled in");
        return;
      }
      
      const response = await BillModel.addBill(
        newBill.name,
        parseFloat(newBill.amount),
        newBill.dueDate,
        newBill.category
      );
      
      if (response.success) {
        setSuccessMessage("Bill added successfully");
        resetForm();
        closeForm();
        refreshBills();
        
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        setError(response.message || "Failed to add bill");
      }
    } catch (err) {
      setError("An error occurred while adding a bill");
      console.error("Error adding bill:", err);
    } finally {
      setLoading(false);
    }
  }

  static async updateBill(editingBill, setLoading, setError, setSuccessMessage, resetEditingBill, closeForm, refreshBills) {
    try {
      setLoading(true);
      
      if (!editingBill.name || !editingBill.amount || !editingBill.dueDate || !editingBill.category) {
        setError("All fields must be filled in");
        return;
      }
      
      const response = await BillModel.updateBill(
        editingBill.id,
        editingBill.name,
        parseFloat(editingBill.amount),
        editingBill.dueDate,
        editingBill.category
      );
      
      if (response.success) {
        setSuccessMessage("Bill updated successfully");
        resetEditingBill();
        closeForm();
        refreshBills();
        
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        setError(response.message || "Failed to update bill");
      }
    } catch (err) {
      setError("An error occurred while updating the bill");
      console.error("Error updating bill:", err);
    } finally {
      setLoading(false);
    }
  }

  static async deleteBill(billId, editingBill, setLoading, setError, setSuccessMessage, resetEditingBill, closeForm, refreshBills) {
    if (!window.confirm("Are you sure you want to mark this bill as paid?")) {
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await BillModel.deleteBill(billId);
      
      if (response.success) {
        setSuccessMessage("The bill has been paid");
        
        if (editingBill && editingBill.id === billId) {
          resetEditingBill();
          closeForm();
        }
        
        refreshBills();
        
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        setError(response.message || "Failed to mark bill as paid");
      }
    } catch (err) {
      setError("An error occurred while marking the bill as paid.");
      console.error("Error marking bill as paid:", err);
    } finally {
      setLoading(false);
    }
  }
  
  static handleInputChange(e, editingBill, setEditingBill, newBill, setNewBill) {
    const { name, value } = e.target;
    if (editingBill) {
      setEditingBill({
        ...editingBill,
        [name]: value
      });
    } else {
      setNewBill({
        ...newBill,
        [name]: value
      });
    }
  }
  
  static handleEditBill(bill, setEditingBill, setShowAddBillForm) {
    setEditingBill(bill);
    setShowAddBillForm(true);
  }
  
  static handleCancelEdit(setEditingBill, setShowAddBillForm) {
    setEditingBill(null);
    setShowAddBillForm(false);
  }
  
  static dismissNotification(notificationId, notifications, setNotifications) {
    setNotifications(notifications.filter(notification => notification.id !== notificationId));
  }
  
  static toggleCategoryExpand(category, setExpandedCategories) {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  }
  
  static formatCurrency(amount) {
    return new Intl.NumberFormat("id-ID", {
      style: "decimal",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  static formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  static isOverdue(dueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const billDueDate = new Date(dueDate);
    billDueDate.setHours(0, 0, 0, 0);
    return billDueDate < today;
  }

  static isDueTomorrow(dueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const billDueDate = new Date(dueDate);
    billDueDate.setHours(0, 0, 0, 0);
    
    return billDueDate.getTime() === tomorrow.getTime();
  }

  static checkBillsStatus(billsList) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const newNotifications = [];
    
    billsList.forEach(bill => {
      const dueDate = new Date(bill.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        newNotifications.push({
          id: `overdue-${bill.name}-${bill.dueDate}`,
          type: 'overdue',
          message: `Bill ${bill.name} of Rp ${this.formatCurrency(bill.amount)} is overdue since ${this.formatDate(bill.dueDate)}`,
          bill
        });
      } 
      else if (dueDate.getTime() === tomorrow.getTime()) {
        newNotifications.push({
          id: `due-tomorrow-${bill.name}-${bill.dueDate}`,
          type: 'due-tomorrow',
          message: `Bill ${bill.name} of Rp ${this.formatCurrency(bill.amount)} is due tomorrow`,
          bill
        });
      }
    });
    
    return newNotifications;
  }

  static groupBillsByCategory(bills) {
    return bills.reduce((acc, bill) => {
      const category = bill.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(bill);
      return acc;
    }, {});
  }

  static calculateTotalBillAmount(bills) {
    return bills.reduce((sum, bill) => sum + parseFloat(bill.amount || 0), 0);
  }
  
  static getCategoryColor(category) {
    switch (category) {
      case "Rent":
        return "bg-indigo-200 text-indigo-800";
      case "Electricity":
        return "bg-indigo-200 text-indigo-800";
      case "Internet":
        return "bg-indigo-200 text-indigo-800";
      case "Water":
        return "bg-indigo-200 text-indigo-800";
      case "Vehicle":
        return "bg-indigo-200 text-indigo-800";
      case "Heart":
        return "bg-indigo-200 text-indigo-800";
      default:
        return "bg-indigo-200 text-indigo-800";
    }
  }
}

export default BillController;