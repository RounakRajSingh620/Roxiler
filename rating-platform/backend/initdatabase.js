import { db } from './src/config/database.js';
import bcrypt from 'bcryptjs';

const initializeDatabase = async () => {
  try {
    console.log('🚀 Starting database initialization...');

    // Create users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(60) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        address VARCHAR(400) NOT NULL,
        role ENUM('admin', 'user', 'store_owner') NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_role (role),
        INDEX idx_name (name)
      )
    `);
    console.log('✅ Users table created');

    // Create stores table
    await db.query(`
      CREATE TABLE IF NOT EXISTS stores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(60) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        address VARCHAR(400) NOT NULL,
        owner_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_name (name),
        INDEX idx_email (email),
        INDEX idx_owner (owner_id)
      )
    `);
    console.log('✅ Stores table created');

    // Create ratings table
    await db.query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        store_id INT NOT NULL,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_store (user_id, store_id),
        INDEX idx_store (store_id),
        INDEX idx_user (user_id)
      )
    `);
    console.log('✅ Ratings table created');

    // Check if admin exists
    const [existingAdmin] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      ['admin@platform.com']
    );

    if (existingAdmin.length === 0) {
      // Create admin user
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      await db.query(
        'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
        [
          'System Administrator Account',
          'admin@platform.com',
          hashedPassword,
          '123 Admin Street, Admin City, AC 12345',
          'admin'
        ]
      );
      console.log('✅ Admin user created');
      console.log('📧 Email: admin@platform.com');
      console.log('🔐 Password: Admin@123');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    console.log('🎉 Database initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
};

initializeDatabase();