const express = require('express');
const User = require('../models/User');
const router = express.Router();
// Register route
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).send({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});
// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (user) {
      res.status(200).send({ message: 'Login successful', user });
    } else {
      res.status(400).send({ message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});
module.exports = router;