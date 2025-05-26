import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as mysqlSchema from "./mysql-schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. For XAMPP, use: mysql://root:@localhost:3306/formcraft_pro",
  );
}

const connection = await mysql.createConnection(process.env.DATABASE_URL);
export const db = drizzle(connection, { schema: mysqlSchema, mode: 'default' });