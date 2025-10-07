const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./config/dbConnection');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: [
    'http://127.0.0.1:5501',
    'http://localhost:5501',
    'http://127.0.0.1:5500',
    'http://localhost:5500'
  ],
  credentials: true
}));

// Testing with Logging every request to see if it reaches backend
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

connectDB().then(() => {
  console.log(' MongoDB connected');

  // Routes
  const authRoutes = require('./routes/register'); 
  app.use('/register', authRoutes);

  const logoutRoute = require('./routes/logout');
  app.use('/logout', logoutRoute);

  const loginRoute = require('./routes/auth');
  app.use('/login', loginRoute);

  const recipeRoutes = require('./routes/recipeOps');
  app.use('/recipes', recipeRoutes);
  

  app.listen(3500, () => console.log(' Server running on port 3500'));
}).catch(err => {
  console.error(' Failed to connect to MongoDB', err);
  process.exit(1);
});
