const Otp = require('../models/otpModel');
const User = require('../models/userModel');
const { sendMail } = require('../config/mailer');
const jwt = require('jsonwebtoken');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

exports.requestOtp = async (req, res) => {
  try {
    const { email, name } = req.body || {};
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const code = generateCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await Otp.deleteMany({ email }); // invalidate previous
    await Otp.create({ email, code, expiresAt });

    const subject = 'CREA verification code';
    const html = `<p>Hi${name ? ' ' + name : ''},</p><p>Your CREA verification code is <b>${code}</b>. It expires in 15 minutes.</p>`;
    await sendMail({ to: email, subject, html, text: `Your CREA verification code is ${code}` });
    return res.json({ success: true });
  } catch (e) {
    console.error('requestOtp error:', e);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, code, name, password } = req.body || {};
    if (!email || !code) return res.status(400).json({ message: 'Email and code are required' });
    const record = await Otp.findOne({ email, code });
    if (!record) return res.status(400).json({ message: 'Invalid code' });
    if (record.expiresAt.getTime() < Date.now()) return res.status(400).json({ message: 'Code expired' });

    // mark verified and consume
    record.verified = true;
    await record.save();
    await Otp.deleteMany({ email });

    // Ensure user exists; if not, create
  let user = await User.findOne({ email });
    if (!user) {
      if (!password || !name) return res.status(400).json({ message: 'Name and password required to create account' });
      user = await User.create({ name, email, password, role: 'member' });
    }
    const token = generateToken(user._id);
    return res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token });
  } catch (e) {
    console.error('verifyOtp error:', e);
    return res.status(500).json({ message: 'Server error' });
  }
};
