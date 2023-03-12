import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config({ path: './config/config.env' });


cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
	secure: true,
});

export const fileUpload = (file, folder) => {
	return new Promise((resolve, reject) => {
		cloudinary.uploader
			.upload_stream(
				{
					resource_type: 'auto',
					folder: 'doclock/'.concat(folder),
					public_id: folder.concat('-', Date.now()),
				},
				(e, result) => {
					if (e) reject(e);
					else resolve(result);
				}
			)
			.end(file.buffer);
	});
};
