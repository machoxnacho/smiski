const express = require('express');
const path = require('path');
const AWS = require('aws-sdk');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Use local DynamoDB credentials or role-based credentials
AWS.config.update({ region: 'us-east-1' });

const dynamo = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'PomodoroUser';

app.use(express.static(path.join(__dirname, 'build')));

// Get coins
app.get('/coins', async (req, res) => {
  const userId = req.headers['x-user-id'] || 'test-user-123';
  try {
    const result = await dynamo
      .get({
        TableName: TABLE_NAME,
        Key: { userId },
      })
      .promise();

    res.json({ coins: result.Item?.coins || 0 });
  } catch (err) {
    console.error('DynamoDB GET error:', err);
    res.status(500).json({ error: 'Failed to fetch coins' });
  }
});

// Update coins
app.post('/coins', async (req, res) => {
  const userId = req.headers['x-user-id'] || 'test-user-123';
  const { coinsToAdd } = req.body;

  try {
    await dynamo
      .update({
        TableName: TABLE_NAME,
        Key: { userId },
        UpdateExpression: 'ADD coins :val',
        ExpressionAttributeValues: {
          ':val': coinsToAdd,
        },
        ReturnValues: 'UPDATED_NEW',
      })
      .promise();

    res.json({ message: 'Coins updated successfully' });
  } catch (err) {
    console.error('DynamoDB PUT error:', err);
    res.status(500).json({ error: 'Failed to update coins' });
  }
});

// Fallback: serve React app for any unknown route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

