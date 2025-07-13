import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// Simple test endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Hello from Expense Tracker API!' });
});

app.get('/test', (req, res) => {
  res.json({ 
    message: 'Test endpoint working!',
    timestamp: new Date().toISOString()
  });
});

export default app;
