# ✨ PayPlus

A comprehensive personal finance management platform that empowers users to take control of their financial life through intelligent tracking, bill management, and collaborative features.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v16+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![Flutter](https://img.shields.io/badge/Flutter-3.0+-blue.svg)](https://flutter.dev/)

---

## 🌟 Overview

PayPlus is a full-stack personal finance management solution that bridges the gap between traditional banking and modern financial needs. Available across web and mobile platforms, it provides users with comprehensive tools to manage their financial ecosystem efficiently.

## 🔑 Key Features

### 💰 **Financial Management**
- **Income & Expense Tracking**: Monitor all financial transactions with detailed categorization
- **Savings Goals**: Set and track savings targets with visual progress indicators
- **Transaction History**: Comprehensive view of all financial activities with advanced filtering

### 👥 **Social Finance**
- **Friend Management**: Connect with friends for shared financial activities
- **Bill Splitting**: Effortlessly split expenses and track shared costs
- **Group Expenses**: Manage group purchases and shared financial responsibilities

### 🧠 **Smart Assistance**
- **AI Chatbot**: Get personalized financial advice and assistance
- **Bill Reminders**: Never miss a payment with intelligent notification system
- **Financial Insights**: Receive actionable insights based on spending patterns

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- Flutter SDK (v3.0 or higher)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/FaustaAkbar/PayPlus.git
   cd PayPlus
   ```

2. **Backend Setup**
   ```bash
   cd payplus_backend
   npm install
   
   # Configure environment variables
   cp .env.example .env
   # Edit .env with your database credentials and configuration
   
   # Initialize database
   node db_init.js
   
   # Start the server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd PayPlus_FE
   npm install
   
   # Start development server
   npm run dev
   ```
   The web application will be available at `http://localhost:5173`

4. **Mobile App Setup**
   ```bash
   cd PayPlus_Mobile
   flutter pub get
   
   # Run on connected device or emulator
   flutter run
   ```

### Environment Configuration

Create a `.env` file in the `payplus_backend` directory:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=payplus_db
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

---

## 📱 Application Modules

| Module | Description | Key Features |
|--------|-------------|--------------|
| **Authentication** | User registration and login system | Secure signup, login, password recovery |
| **Dashboard** | Financial overview and summary | Real-time balance, recent transactions, spending insights |
| **Transactions** | Income and expense management | Add/edit transactions, categorization, search & filter |
| **Savings** | Savings goal tracking | Goal setting, progress tracking, milestone notifications |
| **Bill Management** | Bill tracking and splitting | Bill creation, friend splitting, payment reminders |
| **Social Features** | Friend and group management | Add friends, create groups, manage shared expenses |
| **Chatbot** | AI-powered financial assistant | Financial advice, transaction queries, budget suggestions |
| **Settings** | Profile and app configuration | Profile management, preferences, security settings |

---

## 📸 Screenshots

<div align="center">
  <img src="PayPlus_FE/public/LandingPage.png" width="600" alt="PayPlus Landing Page" />
  <p><em>Modern and intuitive landing page design</em></p>
</div>

---

## 👥 Development Team

| Developer | Role | Contributions |
|-----------|------|---------------|
| [**Fausta Akbar W. N. B.**](https://github.com/FaustaAkbar) | Project Manager | Dashboard, Profile Settings, Income Management |
| [**Zaidaan Afif Randih**](https://github.com/ZaidaanRandih) | Frontend Lead | Landing Page, Authentication, Transfer System |
| [**Andre Aditya Amann**](https://github.com/andreadityam) | Feature Developer | Savings Management, Top-up System |
| [**Georgio Armando W.K.**](https://github.com/Luxferex) | Backend Developer | Friends System, Chat, AI Chatbot |
| [**M. Rafi Suwardana**](https://github.com/rafisuwardana) | Full-stack Developer | Bill Management, Notification System |
| [**Bryant Jonathan G.**](https://github.com/bryantjonathan) | Data Engineer | Expense Tracking, Transaction History |

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

If you encounter any issues or have questions:
- 📧 Email: zaidanrandih61@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/FaustaAkbar/PayPlus/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/FaustaAkbar/PayPlus/discussions)
