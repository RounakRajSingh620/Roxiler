import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

const promisePool = pool.promise();

const testConnection = async () => {
  try {
    const connection = await promisePool.getConnection();
    console.log('✅ Database connected successfully');
    console.log('📊 Database:', process.env.DB_NAME);
    console.log('🌐 Host:', process.env.DB_HOST);
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('🔍 Check your environment variables:');
    console.error('   DB_HOST:', process.env.DB_HOST ? '✓' : '✗');
    console.error('   DB_USER:', process.env.DB_USER ? '✓' : '✗');
    console.error('   DB_PASSWORD:', process.env.DB_PASSWORD ? '✓' : '✗');
    console.error('   DB_NAME:', process.env.DB_NAME ? '✓' : '✗');
    process.exit(1);
  }
};

export { promisePool as db, testConnection };