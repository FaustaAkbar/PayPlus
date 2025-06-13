require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'payplus',
};

async function initializeDb() {
  let connection;
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
    });

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await connection.query(`USE ${dbConfig.database}`);

    console.log(`Database '${dbConfig.database}' created or already exists`);

    // Create tables using the provided SQL schema
    await createTables(connection);

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  } finally {
    if (connection) await connection.end();
  }
}

async function createTables(connection) {
  try {
    // Users table - removed role field
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        phone bigint(50) NOT NULL,
        name varchar(250) NOT NULL,
        email varchar(250) NOT NULL,
        password varchar(250) NOT NULL,
        balance bigint(50) NOT NULL,
        PRIMARY KEY (phone)
      )
    `);

    // Savings table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS savings (
        id int(11) NOT NULL AUTO_INCREMENT,
        phone bigint(50) NOT NULL,
        nama varchar(255) NOT NULL,
        deskripsi text DEFAULT NULL,
        target bigint(50) NOT NULL,
        terkumpul bigint(50) DEFAULT 0,
        PRIMARY KEY (id),
        KEY fk_savings_user (phone),
        CONSTRAINT fk_savings_user FOREIGN KEY (phone) REFERENCES users (phone) ON DELETE CASCADE ON UPDATE CASCADE
      )
    `);

    // Bill table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS bill (
        id int(11) NOT NULL AUTO_INCREMENT,
        phone bigint(15) NOT NULL,
        name varchar(100) DEFAULT NULL,
        amount double DEFAULT NULL,
        dueDate varchar(10) DEFAULT NULL,
        category text DEFAULT NULL,
        PRIMARY KEY (id),
        KEY phone (phone),
        CONSTRAINT bill_ibfk_1 FOREIGN KEY (phone) REFERENCES users (phone) ON DELETE CASCADE ON UPDATE CASCADE
      )
    `);

    // Income table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS income (
        id int(11) NOT NULL AUTO_INCREMENT,
        amount int(11) NOT NULL,
        phone bigint(50) NOT NULL,
        sender_phone bigint(50) NOT NULL,
        type enum('normal','gift','topup') NOT NULL,
        date date NOT NULL,
        message text DEFAULT NULL,
        PRIMARY KEY (id),
        KEY fk_income_user (phone),
        CONSTRAINT fk_income_user FOREIGN KEY (phone) REFERENCES users (phone) ON DELETE CASCADE ON UPDATE CASCADE
      )
    `);

    // Expense table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS expense (
        id int(11) NOT NULL AUTO_INCREMENT,
        amount int(11) NOT NULL,
        phone bigint(50) NOT NULL,
        receiver_phone bigint(50) NOT NULL,
        type enum('normal','gift') NOT NULL,
        date date NOT NULL,
        message text DEFAULT NULL,
        PRIMARY KEY (id),
        KEY fk_expense_user (phone),
        CONSTRAINT fk_expense_user FOREIGN KEY (phone) REFERENCES users (phone) ON DELETE CASCADE ON UPDATE CASCADE
      )
    `);

    // Friends table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS friends (
        id int(11) NOT NULL AUTO_INCREMENT,
        user_phone bigint(50) NOT NULL,
        friend_phone bigint(50) NOT NULL,
        status enum('pending','accepted','rejected') NOT NULL DEFAULT 'pending',
        friend_nickname VARCHAR(255) DEFAULT NULL, 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY unique_friendship (user_phone, friend_phone),
        KEY fk_user_friends (user_phone),
        KEY fk_friend_user (friend_phone),
        CONSTRAINT fk_user_friends FOREIGN KEY (user_phone) REFERENCES users (phone) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_friend_user FOREIGN KEY (friend_phone) REFERENCES users (phone) ON DELETE CASCADE ON UPDATE CASCADE
      )
    `);

    // messages table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id int(11) NOT NULL AUTO_INCREMENT,
        sender_phone bigint(50) NOT NULL,
        receiver_phone bigint(50) NOT NULL,
        message text NOT NULL,
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
        PRIMARY KEY (id),
        KEY fk_sender (sender_phone),
        KEY fk_receiver (receiver_phone),
        CONSTRAINT fk_sender FOREIGN KEY (sender_phone) REFERENCES users (phone) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_receiver FOREIGN KEY (receiver_phone) REFERENCES users (phone) ON DELETE CASCADE ON UPDATE CASCADE
      )
    `);

    // Tambahkan tabel chatbot_history
    await connection.query(`
      CREATE TABLE IF NOT EXISTS chatbot_history (
        id int(11) NOT NULL AUTO_INCREMENT,
        phone bigint(50) NOT NULL,
        user_message text NOT NULL,
        bot_response text NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY fk_chatbot_user (phone),
        CONSTRAINT fk_chatbot_user FOREIGN KEY (phone) REFERENCES users (phone) ON DELETE CASCADE ON UPDATE CASCADE
      )
    `);
    // Insert sample data
    await insertSampleData(connection);

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}

async function insertSampleData(connection) {
  try {
    // Check if sample user already exists
    const [existingUsers] = await connection.query('SELECT * FROM users WHERE phone = ?', ['6281301220081']);

    if (existingUsers.length > 0) {
      console.log('Sample data already exists, skipping insertion');
      return;
    }

    // Hash passwords
    const saltRounds = 10;
    const hashedPassword1 = await bcrypt.hash('0081', saltRounds);
    const hashedPassword2 = await bcrypt.hash('0310', saltRounds);
    const hashedPassword3 = await bcrypt.hash('3168', saltRounds);
    const hashedPassword4 = await bcrypt.hash('3187', saltRounds);
    const hashedPassword5 = await bcrypt.hash('3393', saltRounds);
    const hashedPassword6 = await bcrypt.hash('0221', saltRounds); // Password baru untuk Georgio

    // Insert sample users with hashed passwords - removed role field
    await connection.query(
      `
      INSERT INTO users (phone, name, email, password, balance) VALUES
      (6281301220081, 'Fausta Akbar', 'fausta@gmail.com', ?, 10300000),
      (6281301220310, 'Bryant Jonathan', 'bryant@gmail.com', ?, 6700000),
      (6281301223168, 'Andre Aditya Amann', 'andre@gmail.com', ?, 5000000),
      (6281301223187, 'Zaidaan Afif', 'zaidaan@gmail.com', ?, 3000000),
      (6281301223393, 'Rafi Suwardana', 'rafisuwardana@gmail.com', ?, 8000000),
      (6281301220221, 'Georgio Armando', 'georgio@gmail.com', ?, 8888888)
    `,
      [hashedPassword1, hashedPassword2, hashedPassword3, hashedPassword4, hashedPassword5, hashedPassword6]
    );
    console.log('Sample users created with hashed passwords');

    // Insert sample savings
    await connection.query(`
      INSERT INTO savings (id, phone, nama, deskripsi, target, terkumpul) VALUES
      (1, 6281301220081, 'motor', 'menabung untuk motor mio', 7000000, 100000),
      (2, 6281301223393, 'Beli Mobil', 'menabung mobil pajero', 500000000, 4000000)
    `);
    console.log('Sample savings created');

    // Insert sample bills
    await connection.query(`
      INSERT INTO bill (id, phone, name, amount, dueDate, category) VALUES
      (1, 6281301220081, 'Kost', 1200000, '2025-01-04', 'Rent'),
      (2, 6281301220081, 'Token Listrik', 50000, '2025-01-08', 'Electricity'),
      (3, 6281301220081, 'BPJS', 350000, '2025-02-03', 'Heart'),
      (4, 6281301220081, 'Motor', 5000000, '2025-01-07', 'Vehicle'),
      (5, 6281301223393, 'Motor', 5000000, '2025-01-07', 'Vehicle')
    `);
    console.log('Sample bills created');

    // Insert sample expense
    await connection.query(`
      INSERT INTO expense (id, amount, phone, receiver_phone, type, date, message) VALUES
      (1, 200000, 6281301220081, 6281301223168, 'gift', '2025-01-05', 'hai andre'),
      (2, 1000, 6281301223393, 6281301220081, 'gift', '2025-01-05', 'halo kamu'),
      (3, 50000, 6281301223168, 6281301223393, 'gift', '2025-01-06', 'makan yaa'),
      (4, 8000000, 6281301220310, 6281301220081, 'normal', '2025-01-06', NULL),
      (5, 300000, 6281301220310, 6281301220081, 'gift', '2025-01-06', 'halooo'),
      (6, 40000, 6281301223187, 6281301220081, 'normal', '2025-01-01', NULL)
    `);
    console.log('Sample expenses created');

    // Insert sample income
    await connection.query(`
      INSERT INTO income (id, amount, phone, sender_phone, type, date, message) VALUES
      (1, 200000, 6281301223168, 6281301223187, 'gift', '2025-01-05', 'hai andre'),
      (2, 1000000, 6281301220081, 6281301223187, 'topup', '2025-01-05', NULL),
      (3, 6000000, 6281301223393, 6281301223393, 'topup', '2025-01-05', NULL),
      (4, 4000000, 6281301223168, 6281301223168, 'topup', '2025-01-06', NULL),
      (5, 300000, 6281301223393, 6281301223168, 'gift', '2025-01-06', 'Hai raffi'),
      (6, 50000, 6281301223393, 6281301223168, 'gift', '2025-01-06', 'hai kamuuu'),
      (7, 300000, 6281301223393, 6281301223393, 'topup', '2025-01-05', NULL),
      (8, 8000000, 6281301220081, 6281301220310, 'normal', '2025-01-06', NULL),
      (9, 300000, 6281301220081, 6281301220310, 'gift', '2025-01-06', 'halooo')
    `);
    console.log('Sample incomes created');
  } catch (error) {
    console.error('Error inserting sample data:', error);
    throw error;
  }
}

// Run initialization
initializeDb()
  .then(() => {
    console.log('Database initialization completed');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
