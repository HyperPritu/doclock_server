import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserModel } from '../models/User.js';
import user_jwt from '../middleware/user_jwt.js';

const router = express.Router();

router.get('/', user_jwt, async (req, res) => {
	const user = await UserModel.findById(req.user.id).select('-password');
	res.status(200).json({ success: true, user: user });
});

router.post('/register', async (req, res) => {
	const { name, email, phone, password } = req.body;
	const user = await UserModel.findOne({ email });

	if (user) return res.status(400).json({ success: false, msg: 'User already exists!' });

	const hashedPassword = await bcrypt.hash(password, 10);

	const newUser = new UserModel({ name, email, phone, password: hashedPassword });
	await newUser.save();

	jwt.sign({ id: newUser.id }, process.env.SECRET, { expiresIn: 36000 }, (err, token) => {
		if (err) throw err;
		res.status(201).json({ success: true, token: token, msg: 'User Registered Successfully' });
	});
});

router.post('/login', async (req, res) => {
	const { email, password } = req.body;
	const user = await UserModel.findOne({ email });

	if (!user) return res.status(404).json({ success: false, msg: "User Doesn't Exists!" });

	const isPasswordValid = await bcrypt.compare(password, user.password);

	if (!isPasswordValid) return res.status(400).json({ success: false, msg: 'Email or Password is Incorrect' });

	const token = jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: 36000 });

	res.status(202).json({ success: true, token: token, userID: user.id, msg: 'User Logged In Successfully' });
});

export { router as userRouter };
