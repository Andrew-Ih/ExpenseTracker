import express from 'express';
import cors from 'cors';
import userAuthRoutes from './routes/userAuthentication.js';
import userRoutes from './routes/userCrudRoutes.js';

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
app.use('/api/users', userRoutes);

export default app;
