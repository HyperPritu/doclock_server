import mongoose from 'mongoose';

export const UserModel = mongoose.model(
	'users',
	new mongoose.Schema({
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		phone: { type: String, required: true, unique: true },
		password: { type: String, required: true },
	})
);
