const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 5000;

// DynamoDB Setup
AWS.config.update({ region: 'us-east-1' });
const dynamodb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'PomodoroUser';

app.use(cors());
app.use(express.json());

// ✅ Health Check Route (for ALB)
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// ✅ Serve React Frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// ✅ Get Coin Count
app.get('/coins', async (req, res) => {
  const userId = req.headers['x-user-id'] || 'test-user-123';

  const params = {
    TableName: TABLE_NAME,
    Key: { userId }
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

// ✅ Update Coins
app.post('/add-coins', async (req, res) => {
  const userId = req.headers['x-user-id'] || 'test-user-123';
  const coinsToAdd = req.body.coins || 0;

  const params = {
    TableName: TABLE_NAME,
    Key: { userId },
    UpdateExpression: 'SET coins = if_not_exists(coins, :zero) + :coins',
    ExpressionAttributeValues: {
      ':coins': coinsToAdd,
      ':zero': 0
    },
    ReturnValues: 'UPDATED_NEW'
  };

  try {
    const result = await dynamodb.update(params).promise();
    res.json({ coins: result.Attributes.coins });
  } catch (error) {
    console.error('DynamoDB PUT error:', error);
    res.status(500).json({ error: 'Error updating coins' });
  }
});

// ✅ Fallback: Serve index.html for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// ✅ Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
