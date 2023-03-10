import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { userRouter } from './routes/users.js';

dotenv.config({ path: './config/config.env' });

const app = express();

app.use(express.json());

app.use('/auth', userRouter);

connectDB().then(() => app.listen(process.env.PORT || 3000, () => console.log('SERVER STARTED')));
