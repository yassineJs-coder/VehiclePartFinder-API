const express = require('express')

require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;


// Middleware
app.use(express.json());

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
