// Replace:
const TEST_USER_ID = 'test-user-123';

// Remove it completely, and update your routes:

// Get coins
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

// Add coins
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
