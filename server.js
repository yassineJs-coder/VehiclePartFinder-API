const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());

// Connect Database
connectDB();

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT} 😅`));
