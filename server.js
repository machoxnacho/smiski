const express = require('express');
const AWS = require('aws-sdk');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const TABLE_NAME = 'SmiskiUsers';
const TEST_USER_ID = 'test-user-123';

AWS.config.update({ region: 'us-east-1' }); // Change to your region
const dynamoDB = new AWS.DynamoDB.DocumentClient();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

app.get('/api/coins', async (req, res) => {
  try {
    const result = await dynamoDB.get({
      TableName: TABLE_NAME,
      Key: { userId: TEST_USER_ID }
    }).promise();

    const coins = result.Item?.coins ?? 0;
    res.json({ coins });
  } catch (err) {
    console.error('Error fetching coins:', err);
    res.status(500).json({ error: 'Failed to fetch coins' });
  }
});

app.post('/api/add-coins', async (req, res) => {
  const { amount } = req.body;

  try {
    const result = await dynamoDB.get({
      TableName: TABLE_NAME,
      Key: { userId: TEST_USER_ID }
    }).promise();

    const currentCoins = result.Item?.coins ?? 0;
    const newTotal = currentCoins + amount;

    await dynamoDB.put({
      TableName: TABLE_NAME,
      Item: {
        userId: TEST_USER_ID,
        coins: newTotal
      }
    }).promise();

    res.json({ coins: newTotal });
  } catch (err) {
    console.error('Error adding coins:', err);
    res.status(500).json({ error: 'Failed to add coins' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
