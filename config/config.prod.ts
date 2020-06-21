import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const env = 'production';

export default {
  env,
  isProduction: env.toLowerCase() === 'production',
  isDev: env.toLowerCase() === 'development',
  isTest: env.toLowerCase() === 'test',
  dbHost: process.env.DB_HOST,
  dbPort: parseInt(process.env.DB_PORT, 10),
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  productName: 'Books',
};
