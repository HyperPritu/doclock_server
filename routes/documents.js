import express from 'express';
import { DocumentModel } from '../models/Document.js';
import { v2 as cloudinary } from 'cloudinary';
import auth from '../middleware/user_jwt.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
	const documents = await DocumentModel.find({ user: req.user.id });
	res.status(200).json({ success: true, totalDocuments: documents.length });
});

router.post('/', auth, async (req, res) => {
	try {
		const filename = req.body.filename;
		const user = req.user.id;

		const isFileExist = await DocumentModel.findOne({ filename, user });

		if (isFileExist) return res.status(409).json({ success: false, msg: 'Document already exists!' });

		const file = req.files.file;

		const options = {
			public_id: `${Date.now()}`,
			resourse_type: 'auto',
			folder: 'doclock',
		};

		const result = await cloudinary.uploader.upload(file.tempFilePath, options);

		const newDocument = new DocumentModel({ public_id: result.public_id, filename: filename, file_url: result.url, user: user });
		await newDocument.save();

		res.status(200).json({ success: true, public_id: result.public_id, filename: filename, file_url: result.url, user: user });
	} catch (error) {
		console.warn(error);
	}
});

export { router as documentRouter };
