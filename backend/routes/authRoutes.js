import express from 'express';
import User from '../models/User.js';
import User2 from '../models/User2.js';
import transporter from '../config/emailConfig.js';

const router = express.Router();

// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User2.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Email not found' });
        }
        if (password !== user.password) {
            return res.status(400).json({ message: 'Password incorrect' });
        }
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Signup Route
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User2.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already taken' });
        }

        const existingUserr = await User.findOne({ email });
        if (existingUserr) {
            await User.deleteOne({ email });
        }

        // Generate OTP
        const otp = generateOTP();
        const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes
        // console.log(otp);

        // Save OTP in database temporarily
        const newUser = new User({ username, email, password, otp, otpExpiresAt });
        await newUser.save();

        async function SendEmail() {
            const info = await transporter.sendMail({
                from: '"NAYAN" <nayannomm@gmail.com>',
                to: `${email}`,
                subject: "OTP VERIFICATION",
                text: `Enter this OTP to verify your email ${otp}`,
                html: `<h1>Enter this OTP to verify your email ${otp}</h1>`,
            });
            // console.log("Message sent: %s", info.messageId);
        }
        SendEmail();

        res.status(200).json({ message: 'OTP sent to your email' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Verify OTP Route
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, username, password, otp } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        if (user.otpExpiresAt < Date.now()) {
            return res.status(400).json({ message: 'OTP has expired' });
        }

        // Clear OTP fields after successful verification
        await User.deleteOne({ email });

        const newuser2 = new User2({ username, email, password });
        await newuser2.save();

        res.status(200).json({ message: 'OTP verified' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//get all contacts
router.get('/contacts', async (req, res) => {
    try {
        const contacts = await User2.find();
        res.status(200).json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


export default router;
