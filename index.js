const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const { sendEmail } = require('./gmail'); // Update path as necessary
require('dotenv').config();
const cors = require('cors');
const app = express();
const prisma = new PrismaClient();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());
// Referral endpoint
app.post('/api/referral', async (req, res) => {
    const { referrerName, referrerEmail, refereeName, refereeEmail, message } = req.body;

  if (!referrerName || !referrerEmail || !refereeName || !refereeEmail) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const referral = await prisma.referral.create({
      data: {
        referrerName,
        referrerEmail,
        refereeName,
        refereeEmail,
        message,
      },
    });

    // Send email notification
    await sendEmail(referrerName, referrerEmail, referrerEmail,);

    res.status(201).json(referral);
  } catch (error) {
    console.error('Error processing referral:', error);
    res.status(500).json({ error: 'An error occurred while processing your referral' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
