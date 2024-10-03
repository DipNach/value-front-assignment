const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3001;
const SECRET_KEY = 'your_secret_key';

// Middleware to parse request body
app.use(bodyParser.json());

// Simulated users (in real apps, you’d use a database)
const users = [];

// Authentication Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(500).json({ message: 'Failed to authenticate token' });

    // Save user info for use in other routes
    req.userId = decoded.id;
    next();
  });
};

// Register Route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Hash the password before storing
  const hashedPassword = await bcrypt.hash(password, 8);
  
  // Save the user
  users.push({ username, password: hashedPassword });
  
  res.json({ message: 'User registered successfully!' });
});

// Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) return res.status(404).json({ message: 'User not found' });

  // Check password validity
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(401).json({ message: 'Invalid password' });

  // Generate a JWT token
  const token = jwt.sign({ id: user.username }, SECRET_KEY, { expiresIn: 86400 }); // Expires in 24 hours

  res.json({ message: 'Login successful!', token });
});

app.get('/add', authMiddleware, (req, res) => {
    const {num1,num2}=req.query;
    if(validateNumber(num1) && validateNumber(num2)){
        const sum = Number(num1) + Number(num2);
        res.status(200).json({ message: `sucess`, result: sum });
    }else{
        res.status(400).json({ message: `Input should be numbers only` });
    }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

function validateNumber(input) {
    const numberRegex = /^[0-9]+$/;
    return numberRegex.test(input);
  }