import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import userAuthRoutes from './routes/UserAuthenticationRoute.js';
import userProfileManagementRoutes from './routes/UserProfileManagementRoute.js';
import TransactionRoutes from './routes/TransactionRoutes.js';
import BudgetRoutes from './routes/BudgetRoutes.js';
import AIRoutes from './routes/AIRoutes.js';

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 
    'https://andrew-ih-expense-tracker-dev.s3.ca-central-1.amazonaws.com', 
    'https://andrew-ih-expense-tracker-prod.s3.ca-central-1.amazonaws.com', 
    'http://andrew-ih-expense-tracker-dev.s3-website.ca-central-1.amazonaws.com',
    'https://andrew-ih-expense-tracker-prod.s3-website.ca-central-1.amazonaws.com',
  ],
  credentials: true
}));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Authentication routes
app.use('/api/auth', userAuthRoutes);
// User routes
app.use('/api/users', userProfileManagementRoutes);
// Transaction routes
app.use('/api/transactions', TransactionRoutes);
// Budget routes
app.use('/api/budget', BudgetRoutes);
// AI routes
app.use('/api/ai', AIRoutes);

export default app;
