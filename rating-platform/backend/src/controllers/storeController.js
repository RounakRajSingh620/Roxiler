import bcrypt from 'bcryptjs';
import { db } from '../config/database.js';

export const createStore = async (req, res) => {
  try {
    const { name, email, address, password } = req.body;

 
    const [existingStores] = await db.query(
      'SELECT id FROM stores WHERE email = ?',
      [email]
    );

    if (existingStores.length > 0) {
      return res.status(400).json({ message: 'Store email already registered' });
    }


    const [existingUsers] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email already registered as user' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    const [userResult] = await db.query(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, address, 'store_owner']
    );


    const [storeResult] = await db.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name, email, address, userResult.insertId]
    );

    res.status(201).json({
      message: 'Store created successfully',
      store: {
        id: storeResult.insertId,
        name,
        email,
        address,
        owner_id: userResult.insertId
      }
    });
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getAllStores = async (req, res) => {
  try {
    const { name, email, address, sortBy = 'name', sortOrder = 'asc' } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;

    let query = `
      SELECT s.id, s.name, s.email, s.address,
      COALESCE(AVG(r.rating), 0) as rating,
      COUNT(DISTINCT r.id) as totalRatings
    `;


    if (userRole === 'user') {
      query += `,
        (SELECT rating FROM ratings WHERE user_id = ? AND store_id = s.id) as userRating
      `;
    }

    query += `
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE 1=1
    `;

    const params = userRole === 'user' ? [userId] : [];


    if (name) {
      query += ' AND s.name LIKE ?';
      params.push(`%${name}%`);
    }
    if (email) {
      query += ' AND s.email LIKE ?';
      params.push(`%${email}%`);
    }
    if (address) {
      query += ' AND s.address LIKE ?';
      params.push(`%${address}%`);
    }

    query += ' GROUP BY s.id';


    const validSortFields = ['name', 'email', 'address', 'rating'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';
    const sortDir = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
    
    if (sortField === 'rating') {
      query += ` ORDER BY rating ${sortDir}`;
    } else {
      query += ` ORDER BY s.${sortField} ${sortDir}`;
    }

    const [stores] = await db.query(query, params);

    res.json({ stores });
  } catch (error) {
    console.error('Get all stores error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getStoreDashboard = async (req, res) => {
  try {
    const userId = req.user.id;


    const [stores] = await db.query(
      `SELECT s.id, s.name, s.email, s.address,
       COALESCE(AVG(r.rating), 0) as averageRating,
       COUNT(DISTINCT r.user_id) as totalRaters
       FROM stores s
       LEFT JOIN ratings r ON s.id = r.store_id
       WHERE s.owner_id = ?
       GROUP BY s.id`,
      [userId]
    );

    if (stores.length === 0) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const store = stores[0];


    const [raters] = await db.query(
      `SELECT u.id, u.name, u.email, u.address, r.rating, r.created_at
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = ?
       ORDER BY r.created_at DESC`,
      [store.id]
    );

    res.json({
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating: parseFloat(store.averageRating).toFixed(2),
        totalRaters: store.totalRaters
      },
      raters
    });
  } catch (error) {
    console.error('Get store dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};