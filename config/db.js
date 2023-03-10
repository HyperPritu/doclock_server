import mongoose from 'mongoose';

export const connectDB = async () => {
	const connection = await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true});
    console.log(`Connected to Database: ${connection.connection.host}`);    
};

