import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { userRouter } from './routes/users.js';
import { documentRouter } from './routes/documents.js';
import fileUpload from 'express-fileupload';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config({ path: './config/config.env' });

const app = express();

app.use(express.json());

app.use(fileUpload({ useTempFiles: true, limits: { fileSize: 10 * 1024 * 1024 } }));

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use('/auth', userRouter);
app.use('/cloud', documentRouter);

connectDB().then(() => app.listen(process.env.PORT || 3000, () => console.log('SERVER STARTED')));
