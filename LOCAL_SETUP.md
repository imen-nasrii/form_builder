# Local XAMPP Setup Instructions

## Step 1: Install and Start XAMPP
1. Download XAMPP from https://www.apachefriends.org/
2. Install it on your Windows machine
3. Open XAMPP Control Panel
4. Start "Apache" and "MySQL" services

## Step 2: Create Database
1. Open your browser and go to http://localhost/phpmyadmin
2. Click "New" to create a database
3. Name it `formcraft_pro`
4. Click "Create"

## Step 3: Configure Environment
1. In your project folder, create a file called `.env`
2. Add this content:
```
DATABASE_URL=mysql://root:@localhost:3306/formcraft_pro
SESSION_SECRET=your-secret-key-here-make-it-long-and-random
NODE_ENV=development
```

## Step 4: Install Dependencies
Open command prompt in your project folder and run:
```cmd
npm install mysql2
```

## Step 5: Update Database Configuration
In your `server/db.ts` file, replace the content with:
```javascript
import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from "./mysql-schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. For XAMPP, use: mysql://root:@localhost:3306/formcraft_pro",
  );
}

const connection = await mysql.createConnection(process.env.DATABASE_URL);
export const db = drizzle(connection, { schema, mode: 'default' });
```

## Step 6: Create Tables
Run this command to create all necessary tables:
```cmd
npm run db:push
```

## Step 7: Start the Application
```cmd
npm run dev
```

Your application will be available at http://localhost:5000

## Default Admin Account
- Email: imennasri89@gmail.com
- Password: password123

## Features Available Locally
✓ Complete drag-and-drop form builder
✓ All field types (GRIDLKP, LSTLKP, DATEPICKER, etc.)
✓ English/French language toggle
✓ User authentication with admin/user roles
✓ Form templates and custom forms
✓ All component configurators

## Troubleshooting
- Make sure XAMPP MySQL service is running
- Verify database `formcraft_pro` exists in phpMyAdmin
- Check that your `.env` file has the correct DATABASE_URL
- Ensure all dependencies are installed with `npm install`