import express from 'express';
import cors from 'cors';
import userRoutes from './routes/users.js';

const app = express();

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Public route for user database creation after email verification
app.use('/api/users', userRoutes);

export default app;
