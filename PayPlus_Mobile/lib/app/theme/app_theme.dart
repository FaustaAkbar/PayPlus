import 'package:flutter/material.dart';

class AppTheme {
  // Warna utama dari logo PayPlus
  static const Color primaryPurple = Color(0xFF9C3BFF); // Warna ungu
  static const Color primaryOrange = Color(0xFFFFA500); // Warna emas/orange
  static const Color primaryYellow = Color(0xFFFFD700); // Warna kuning emas
  static const Color coinYellow = Color(0xFFFFBC00); // Warna koin kuning

  // Warna latar
  static const Color background = Colors.white;
  static const Color softBackground = Color(0xFFF8F5FF); // Ungu sangat muda

  // Warna text
  static const Color textDark = Color(0xFF33333D);
  static const Color textLight = Color(0xFF6A6A78);

  // Warna aksen
  static const Color accentGreen = Color(0xFF42B342);
  static const Color lightPurple = Color(0xFFE6D8FF);

  // Warna status
  static const Color errorRed = Color(0xFFE53935);
  static const Color successGreen = Color(0xFF43A047);
  static const Color warningAmber = Color(0xFFFBB53A);
  static const Color infoBlue = Color(0xFF2196F3);

  // Bentuk radius
  static const double borderRadius = 12;
  static const double buttonRadius = 24;

  // Pembuatan tema aplikasi
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      primaryColor: primaryPurple,
      colorScheme: ColorScheme.light(
        primary: primaryPurple,
        secondary: primaryOrange,
        tertiary: coinYellow,
        background: background,
        surface: background,
        error: errorRed,
      ),
      scaffoldBackgroundColor: background,
      appBarTheme: AppBarTheme(
        elevation: 0,
        backgroundColor: background,
        iconTheme: IconThemeData(color: primaryPurple),
        titleTextStyle: TextStyle(
          color: textDark,
          fontSize: 20,
          fontWeight: FontWeight.bold,
        ),
      ),
      cardTheme: CardTheme(
        color: Colors.white,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(borderRadius),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryPurple,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(buttonRadius),
          ),
          elevation: 0,
          padding: EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: primaryPurple,
          side: BorderSide(color: primaryPurple),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(buttonRadius),
          ),
          padding: EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: primaryPurple,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(buttonRadius),
          ),
          padding: EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        ),
      ),
      floatingActionButtonTheme: FloatingActionButtonThemeData(
        backgroundColor: primaryPurple,
        foregroundColor: Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
      ),
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: Colors.white,
        selectedItemColor: primaryPurple,
        unselectedItemColor: textLight,
        type: BottomNavigationBarType.fixed,
        elevation: 8,
      ),
      tabBarTheme: TabBarTheme(
        labelColor: primaryPurple,
        unselectedLabelColor: textLight,
        indicatorColor: primaryPurple,
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: softBackground,
        contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(borderRadius),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(borderRadius),
          borderSide: BorderSide(color: primaryPurple),
        ),
      ),
      dividerTheme: DividerThemeData(
        color: Colors.grey.shade200,
        thickness: 1,
      ),
      progressIndicatorTheme: ProgressIndicatorThemeData(
        color: primaryPurple,
      ),
    );
  }

  // Ikon tema akan segera ditambahkan
  static IconThemeData get iconTheme {
    return IconThemeData(
      color: primaryPurple,
      size: 24,
    );
  }

  // Style teks untuk aplikasi
  static TextStyle get headingStyle {
    return TextStyle(
      fontSize: 24,
      fontWeight: FontWeight.bold,
      color: textDark,
    );
  }

  static TextStyle get subheadingStyle {
    return TextStyle(
      fontSize: 18,
      fontWeight: FontWeight.w600,
      color: textDark,
    );
  }

  static TextStyle get bodyStyle {
    return TextStyle(
      fontSize: 16,
      fontWeight: FontWeight.normal,
      color: textDark,
    );
  }

  static TextStyle get smallStyle {
    return TextStyle(
      fontSize: 14,
      fontWeight: FontWeight.normal,
      color: textLight,
    );
  }

  // Decoration box untuk container
  static BoxDecoration get cardDecoration {
    return BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(borderRadius),
      boxShadow: [
        BoxShadow(
          color: Colors.black.withOpacity(0.05),
          spreadRadius: 1,
          blurRadius: 5,
          offset: Offset(0, 2),
        ),
      ],
    );
  }

  static BoxDecoration get softBoxDecoration {
    return BoxDecoration(
      color: softBackground,
      borderRadius: BorderRadius.circular(borderRadius),
    );
  }

  static BoxDecoration get purpleGradientDecoration {
    return BoxDecoration(
      gradient: LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [
          primaryPurple,
          primaryPurple.withOpacity(0.7),
        ],
      ),
      borderRadius: BorderRadius.circular(borderRadius),
    );
  }

  static BoxDecoration get yellowGradientDecoration {
    return BoxDecoration(
      gradient: LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [
          primaryOrange,
          primaryYellow,
        ],
      ),
      borderRadius: BorderRadius.circular(borderRadius),
    );
  }
}
