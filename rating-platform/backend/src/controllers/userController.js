import bcrypt from 'bcryptjs';
import { db } from '../config/database.js';


export const getDashboardStats = async (req, res) => {
  try {

    const [userCount] = await db.query(
      'SELECT COUNT(*) as total FROM users'
    );


    const [storeCount] = await db.query(
      'SELECT COUNT(*) as total FROM stores'
    );

    const [ratingCount] = await db.query(
      'SELECT COUNT(*) as total FROM ratings'
    );

    res.json({
      totalUsers: userCount[0].total,
      totalStores: storeCount[0].total,
      totalRatings: ratingCount[0].total
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Create new user
export const createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;


    const [existingUsers] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, address, role]
    );

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: result.insertId,
        name,
        email,
        address,
        role
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy = 'name', sortOrder = 'asc' } = req.query;

    let query = 'SELECT id, name, email, address, role, created_at FROM users WHERE 1=1';
    const params = [];

    // Apply filters
    if (name) {
      query += ' AND name LIKE ?';
      params.push(`%${name}%`);
    }
    if (email) {
      query += ' AND email LIKE ?';
      params.push(`%${email}%`);
    }
    if (address) {
      query += ' AND address LIKE ?';
      params.push(`%${address}%`);
    }
    if (role) {
      query += ' AND role = ?';
      params.push(role);
    }


    const validSortFields = ['name', 'email', 'address', 'role', 'created_at'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';
    const sortDir = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
    query += ` ORDER BY ${sortField} ${sortDir}`;

    const [users] = await db.query(query, params);

    res.json({ users });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await db.query(
      'SELECT id, name, email, address, role, created_at FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];


    if (user.role === 'store_owner') {
      const [stores] = await db.query(
        `SELECT s.id, s.name, s.email, s.address,
         COALESCE(AVG(r.rating), 0) as rating
         FROM stores s
         LEFT JOIN ratings r ON s.id = r.store_id
         WHERE s.owner_id = ?
         GROUP BY s.id`,
        [id]
      );

      user.store = stores[0] || null;
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};