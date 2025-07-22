import express from 'express';
import cors from 'cors';
import userAuthRoutes from './routes/UserAuthenticationRoute.js';
import userProfileManagementRoutes from './routes/UserProfileManagementRoute.js';
import TransactionRoutes from './routes/TransactionRoutes.js';

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'https://your-frontend-domain.com'],
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

export default app;
