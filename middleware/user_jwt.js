import { verify } from 'jsonwebtoken';

export default async (req, res, next) => {
	const token = req.header('Authorization');

	// Check if Authorization Header is present or not
	if (!token) return res.status(401).json({ success: false, msg: 'No token, authorization denied' });

	// Check the token matches or not
	await verify(token, process.env.SECRET, (err, decoded) => {
		if (err) res.status(401).json({ msg: 'Token not valid' });
		else {
			req.user = decoded;
			next();
		}
	});
};
