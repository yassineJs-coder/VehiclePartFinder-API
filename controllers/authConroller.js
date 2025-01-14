const Otp = require('../models/Otp');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');
const speakeasy = require('speakeasy');

// Twilio setup
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendOtp = async (req, res) => {
    const { phone } = req.body;

    if (!phone) return res.status(400).json({ message: 'Phone number is required' });

    // Generate OTP
    const otp = speakeasy.totp({
        secret: process.env.OTP_SECRET,
        digits: 6,
    });

    // Save OTP with expiration
    const otpExpiration = new Date(Date.now() + 5 * 60 * 1000);
    await Otp.create({ phone, otp, expiresAt: otpExpiration });

    // Send OTP via Twilio
    try {
        await client.messages.create({
            body: `Your verification code is ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone,
        });
        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send OTP', error });
    }
};

const verifyOtp = async (req, res) => {
    const { phone, otp } = req.body;

    if (!phone || !otp) return res.status(400).json({ message: 'Phone and OTP are required' });

    // Validate OTP
    const otpRecord = await Otp.findOne({ phone, otp });
    if (!otpRecord) return res.status(400).json({ message: 'Invalid OTP' });

    if (otpRecord.expiresAt < new Date()) return res.status(400).json({ message: 'OTP expired' });

    // Check or create user
    let user = await User.findOne({ phone });
    if (!user) user = await User.create({ phone, role: 'buyer' });

    // Generate token
    const token = jwt.sign({ id: user._id, phone: user.phone }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ message: 'OTP verified', token, user });
};

module.exports = { sendOtp, verifyOtp };
