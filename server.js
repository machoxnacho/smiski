const express = require('express');
const AWS = require('aws-sdk');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const TABLE_NAME = 'PomodoroUser'; // <-- your existing DynamoDB table

AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

// GET /api/coins?userId=abc123
app.get('/api/coins', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  try {
    const result = await dynamoDB.get({
      TableName: TABLE_NAME,
      Key: { userId }
    }).promise();

    const coins = result.Item?.coins ?? 0;
    res.json({ coins });
  } catch (error) {
    console.error('DynamoDB GET error:', error);
    res.status(500).json({ error: 'Failed to fetch coins' });
  }
});

// POST /api/add-coins with { amount: 5, userId: "abc123" }
app.post('/api/add-coins', async (req, res) => {
  const { amount, userId } = req.body;
  if (!userId || typeof amount !== 'number') {
    return res.status(400).json({ error: 'Missing userId or amount' });
  }

  try {
    const result = await dynamoDB.get({
      TableName: TABLE_NAME,
      Key: { userId }
    }).promise();

    const currentCoins = result.Item?.coins ?? 0;
    const newTotal = currentCoins + amount;

    await dynamoDB.put({
      TableName: TABLE_NAME,
      Item: {
        userId,
        coins: newTotal
      }
    }).promise();

    res.json({ coins: newTotal });
  } catch (error) {
    console.error('DynamoDB PUT error:', error);
    res.status(500).json({ error: 'Failed to update coins' });
  }
});

// Serve React frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
