const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 80;

// DynamoDB Setup
AWS.config.update({ region: 'us-east-1' });
const dynamodb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'PomodoroUser';

app.use(cors());
app.use(express.json());

// ✅ Health check
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// ✅ Serve frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// ✅ API routes
app.get('/api/coins', async (req, res) => {
  const userId = req.query.userId || 'test-user-123';

  const params = {
    TableName: TABLE_NAME,
    Key: { userId },
  };

  try {
    const result = await dynamodb.get(params).promise();
    const coins = result.Item ? result.Item.coins : 0;
    res.json({ coins });
  } catch (error) {
    console.error('DynamoDB GET error:', error);
    res.status(500).json({ error: 'Error fetching coins' });
  }
});
