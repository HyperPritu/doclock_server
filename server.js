import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { userRouter } from './routes/users.js';
import { documentRouter } from './routes/documents.js';

dotenv.config({ path: './config/config.env' });

const app = express();

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true }));


app.use('/auth', userRouter);
app.use('/cloud', documentRouter);

connectDB().then(() => app.listen(process.env.PORT || 3000, () => console.log('SERVER STARTED')));
