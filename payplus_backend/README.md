# PayPlus Backend

API backend for PayPlus application built with Express.js and MySQL.

## Features

- User authentication (login, register)
- User profile management
- Savings management
- Bills tracking
- Transaction history (income and expense)
- Password hashing with bcrypt

## Requirements

- Node.js (v14+)
- MySQL

## Setup

1. Clone the repository

2. Install dependencies

```
npm install
```

3. Set up environment variables
   Copy the `.env.example` file to `.env` and update the variables as needed:

```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=payplus
JWT_SECRET=your_secret_key
```

4. Initialize the database with sample data

```
npm run db:init
```

This will create the database, tables, and insert sample data with hashed passwords.

5. Run the server

```
npm start
```

For development with auto-reload:

```
npm run dev
```

## API Endpoints

### Authentication

- **Login**: `POST /api/auth/login`

  - Request: `{ "phone": "6281301220081", "password": "0081" }`

- **Register**: `POST /api/auth/register`
  - Request: `{ "phone": "6281301229999", "name": "Nama Baru", "email": "newuser@gmail.com", "password": "9999" }`

### Profile

- **Get Profile**: `GET /api/profile/{phone}`

### Savings

- **Create Savings**: `POST /api/savings`

  - Request: `{ "phone": "6281301220081", "nama": "Menabung Motor", "deskripsi": "Untuk motor Mio", "target": 7000000, "terkumpul": 0 }`

- **Get Savings Summary**: `GET /api/savings/summary/{phone}`

### Bills

- **Get Bills**: `GET /api/bills/{phone}`

### Transactions

- **Get Transactions**: `GET /api/transactions/{phone}`
  - Returns both income and expense records for a user

## Database Structure

The application uses the following tables:

1. `users` - Stores user information
2. `savings` - Stores savings goals
3. `bill` - Stores bills and upcoming payments
4. `income` - Stores incoming transactions
5. `expense` - Stores outgoing transactions

## Sample Data

After running the db:init script, the following sample data will be available:

### Users

- Phone: 6281301220081, Password: 0081 (Fausta Akbar, Gold)
- Phone: 6281301220310, Password: 0310 (Bryant Jonathan, Gold)
- Phone: 6281301223168, Password: 3168 (Andre Aditya Amann, Bronze)
- Phone: 6281301223187, Password: 3187 (Zaidaan Afif, Bronze)
- Phone: 6281301223393, Password: 3393 (Rafi Suwardana, Bronze)

**Note**: Although the passwords are listed above for testing, they are stored as bcrypt hashed values in the database.

## Security

- Password encryption using bcrypt
- JWT authentication for API endpoints
