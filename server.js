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

// ✅ Health Check
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// ✅ Serve frontend build (React)
app.use(express.static(path.join(__dirname, 'frontend')));

// ✅ Get Coins – now using query param instead of header
app.get('/api/coins', async (req, res) => {
  const userId = req.query.userId || 'test-user-123';

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

// ✅ Add Coins – also uses query param
app.post('/api/add-coins', async (req, res) => {
  const userId = req.query.userId || 'test-user-123';
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

// ✅ React Router Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// ✅ Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
