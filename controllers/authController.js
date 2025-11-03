import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

// Register a new User 
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body
    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing)
      return res.status(400).json({ message: 'User already existed' })

    if (!password || password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' })

    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
    })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
    return res.status(201).json({
      token,
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// Login a User 
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user)
      return res.status(401).json({ message: 'Invalid credentials' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials' })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// Forgot password 
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user)
      return res.status(404).json({ message: 'User not found' })

    const resetToken = crypto.randomBytes(20).toString('hex')
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    user.resetPasswordToken = hashedToken
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000 // 10 min
    await user.save()

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const message = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password reset request',
      text: `To reset your password, click: ${resetUrl}`,
    }

    await transporter.sendMail(message)
    return res.status(200).json({ message: 'Reset email has been sent' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// Resetting password 
export const resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    })
    if (!user)
      return res.status(400).json({ message: 'Invalid or expired token' })

    if (!req.body.password || req.body.password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' })

    const hashed = await bcrypt.hash(req.body.password, 10)
    user.password = hashed
    user.resetPasswordExpire = undefined
    user.resetPasswordToken = undefined
    await user.save()

    return res.status(200).json({ message: 'Password has been successfully reset' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
