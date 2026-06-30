require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/config/db');

const PORT = process.env.PORT || 5000;

let isConnected = false;

async function ensureDBConnected() {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
}

// For Vercel serverless: connect to DB on each cold start
ensureDBConnected();

// For local development: run a normal listening server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 FlexForge server running on port ${PORT}`);
  });
}

module.exports = app;