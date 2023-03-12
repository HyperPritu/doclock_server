import mongoose from 'mongoose';

export const DocumentModel = mongoose.model(
	'documents',
	new mongoose.Schema(
		{
			public_id: { type: String, required: true, unique: true },
			filename: { type: String, required: true },
			file_url: { type: String, required: true },
			user: { type: mongoose.Schema.Types.ObjectID, required: true, ref: 'User' },
		},
		{ timestamps: true }
	)
);
