import { db } from '../config/database.js';


export const submitRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.id;


    const [stores] = await db.query(
      'SELECT id FROM stores WHERE id = ?',
      [storeId]
    );

    if (stores.length === 0) {
      return res.status(404).json({ message: 'Store not found' });
    }


    const [existingRatings] = await db.query(
      'SELECT id FROM ratings WHERE user_id = ? AND store_id = ?',
      [userId, storeId]
    );

    if (existingRatings.length > 0) {
   
      await db.query(
        'UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?',
        [rating, userId, storeId]
      );

      res.json({ message: 'Rating updated successfully' });
    } else {
  
      await db.query(
        'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)',
        [userId, storeId, rating]
      );

      res.status(201).json({ message: 'Rating submitted successfully' });
    }
  } catch (error) {
    console.error('Submit rating error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getUserRating = async (req, res) => {
  try {
    const { storeId } = req.params;
    const userId = req.user.id;

    const [ratings] = await db.query(
      'SELECT rating FROM ratings WHERE user_id = ? AND store_id = ?',
      [userId, storeId]
    );

    if (ratings.length === 0) {
      return res.json({ rating: null });
    }

    res.json({ rating: ratings[0].rating });
  } catch (error) {
    console.error('Get user rating error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};