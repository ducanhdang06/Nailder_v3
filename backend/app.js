// Main sever file, setup express, middleware and load routes
// app.js (CommonJS version)
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/users'));
// app.use('/api/feed', require('./routes/feed'));
// app.use('/api/matches', require('./routes/matches'));
// app.use('/api/chat', require('./routes/chat'));
// app.use('/api/designs', require('./routes/designs'));

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
});

