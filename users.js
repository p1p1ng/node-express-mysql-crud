const express = require('express');
const db = require('../config/db');
const router = express.Router();

// READ - Get all users
router.get('/', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
});

// READ - Get user by ID
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM users WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(result[0]);
  });
});

// CREATE - Add new user
router.post('/', (req, res) => {
  const { name, email, age } = req.body;
  if (!name || !email || !age) return res.status(400).json({ message: 'All fields are required' });

  db.query('INSERT INTO users (name, email, age) VALUES (?, ?, ?)', [name, email, age], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'User created successfully' });
  });
});

// UPDATE - Edit user
router.put('/:id', (req, res) => {
  const { name, email, age } = req.body;
  db.query('UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?', 
    [name, email, age, req.params.id], 
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
      res.status(200).json({ message: 'User updated successfully' });
    }
  );
});

// DELETE - Remove user
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM users WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  });
});

module.exports = router;
