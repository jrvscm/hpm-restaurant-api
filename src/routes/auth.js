const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { User, Organization, UserPoints } = require('../models');
const { generateToken } = require('../utils/auth');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const nodemailer = require('nodemailer');
const router = express.Router();

/**
 * Create an organization and register the first admin user.
 */
router.post('/register/organization', async (req, res) => {
    const { organizationName, email, password, fullName, phone } = req.body;

    // Validate required fields
    if (!organizationName || !email || !password || !fullName || !phone) {
        return res.status(400).json({
            error: 'Organization name, email, password, full name, and phone are required.',
        });
    }

    try {
        // Check if the organization already exists
        const existingOrganization = await Organization.findOne({ where: { name: organizationName } });
        if (existingOrganization) {
            return res.status(400).json({ error: 'Organization name already in use.' });
        }

        // Generate an API key
        const apiKey = crypto.randomBytes(32).toString('hex');

        // Create the organization
        const organization = await Organization.create({ 
            name: organizationName,
            apiKey, // Include API key in the organization
        });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Create the admin user
        const admin = await User.create({
            email,
            password: hashedPassword,
            fullName,
            role: 'admin',
            status: 'pending',
            organizationId: organization.id,
            phone,
            verificationToken,
        });

        // Generate a JWT token for the new admin
        const updatedToken = generateToken(admin);

        res.cookie('token', updatedToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax', // For cross-domain cookies
            ...(process.env.NODE_ENV === 'production' && { domain: '.pizzalander.netlify.app' }),
            maxAge: 60 * 60 * 1000, // 1 hour
            path: '/',
          });          

        // Set up Nodemailer transporter for production
        const transporter = process.env.NODE_ENV === 'development' ? {} : nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS, 
            },
        });

        // Construct the verification email
        const verificationUrl = `${process.env.API_BASE_URL}/auth/verify/${verificationToken}`;
        if (process.env.NODE_ENV === 'development') {
            console.log(verificationUrl);
        } else {
            const mailOptions = {
                from: 'jarvis@highplainsmedia.com', // Sender address
                to: email, // Recipient email
                subject: 'Verify Your Account',
                text: `Welcome to ${organizationName}! Please verify your account by clicking the following link: ${verificationUrl}`,
                html: `<p>Welcome to ${organizationName}!</p>
                    <p>Please verify your account by clicking the link below:</p>
                    <a href="${verificationUrl}">${verificationUrl}</a>`,
            };

            // Send the email
            await transporter.sendMail(mailOptions);
        }

        res.status(201).json({
            message: 'Organization and admin registered successfully. Verification email sent!',
            organization: {
                id: organization.id,
                name: organization.name,
                apiKey, 
            },
            user: {
                id: admin.id,
                email: admin.email,
                role: admin.role,
                organizationId: admin.organizationId,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to register organization and admin.' });
    }
});


/**
 * Register a tenant or invited admin to an existing organization.
 */
router.post('/register/invite', async (req, res) => {
    const { email, password, fullName, token } = req.body;

    if (!email || !password || !fullName || !token) {
        return res.status(400).json({ error: 'Email, password, full name, and invite token are required.' });
    }

    try {
        const invitingUser = await User.findOne({ where: { verificationToken: token } });
        if (!invitingUser || invitingUser.status !== 'invited') {
            return res.status(400).json({ error: 'Invalid or expired invitation token.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            email,
            password: hashedPassword,
            fullName,
            role: 'user',
            organizationId: invitingUser.organizationId,
            status: 'pending',
        });

        invitingUser.verificationToken = null;
        await invitingUser.save();

        res.status(201).json({ message: 'User registered successfully. Verification email sent!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to register user.' });
    }
});

/**
 * Admin invites users to join their organization.
 */
router.post('/invite', authenticate, authorize(['admin']), async (req, res) => {
    const { email, role } = req.body;

    if (!email || !['admin', 'user'].includes(role)) {
        return res.status(400).json({ error: 'Valid email and role are required.' });
    }

    try {
        const adminUser = await User.findByPk(req.user.id);

        const verificationToken = crypto.randomBytes(32).toString('hex');
        await User.create({
            email,
            role: role === 'admin' ? 'admin' : 'user',
            status: 'invited',
            organizationId: adminUser.organizationId,
            verificationToken,
        });

        // console.log(`Invitation email sent: http://your-frontend-url.com/register/invite/${verificationToken}`);

        res.status(201).json({ message: `Invitation sent to ${email}.` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to invite user.' });
    }
});

/**
 * Log in a user and return a JWT token.
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        if (user.status === 'pending') {
            return res.status(403).json({ error: 'Account not verified.' });
        }

        const token = generateToken(user);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax', // For cross-domain cookies
            ...(process.env.NODE_ENV === 'production' && { domain: '.pizzalander.netlify.app' }),
            maxAge: 60 * 60 * 1000, // 1 hour
            path: '/',
        }); 

        // Send the response with additional user details if needed
        res.status(200).json({ 
            message: 'Login successful', 
            role: user.role, 
            id: user.id
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to log in user.' });
    }
});

/**
 * Verify a user's account using a token.
 */
router.get('/verify/:token', async (req, res) => {
    try {
      const { token } = req.params;
  
      const user = await User.findOne({ where: { verificationToken: token } });
  
      if (!user) {
        return res.redirect(`${process.env.FRONTEND_URL}/verification?failed=1`);
      }
  
      user.status = 'verified';
      user.verificationToken = null;
      await user.save();
  
      const updatedToken = generateToken({
        id: user.id,
        role: user.role,
        organizationId: user.organizationId,
        status: user.status,
      });
  
      res.cookie('token', updatedToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', // For cross-domain cookies
        ...(process.env.NODE_ENV === 'production' && { domain: '.pizzalander.netlify.app' }),
        maxAge: 60 * 60 * 1000, // 1 hour
        path: '/',
      }); 
  
        res.redirect(`${process.env.FRONTEND_URL}/verification?success=1`);
    } catch (err) {
      res.redirect(`${process.env.FRONTEND_URL}/verification?failed=1`);
    }
  });
  

/**
 * Resend the verification email.
 */
router.post('/resend-verification', async (req, res) => {
    const { email } = req.body;
    const { apikey: apiKey } = req.headers;

    if (!email || !apiKey) {
        return res.status(400).json({ error: 'Invalid credentials' });
    }

    try {
        // Find organization by API key
        const organization = await Organization.findOne({ where: { apiKey } });
        if (!organization) {
            return res.status(401).json({ error: 'Invalid API key.' });
        }

        // Find the user by email
        const user = await User.findOne({ where: { email } });

        // Check if user exists and is not already verified
        if (!user || user.status === 'verified') {
            return res.status(400).json({ error: 'User not found or already verified.' });
        }

        // Generate a new verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        user.verificationToken = verificationToken;
        await user.save();

        // Set up Nodemailer transporter
        const transporter = process.env.NODE_ENV === 'development' ? {} : nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER, 
                pass: process.env.SMTP_PASS, 
            },
        });

        // Construct the verification email
        const verificationUrl = `${process.env.API_BASE_URL}/auth/verify/${verificationToken}`;
        if(process.env.NODE_ENV === 'development') {
            console.log(verificationUrl);
        } else {
            const mailOptions = {
                from: 'jarvis@highplainsmedia.com', // Sender address
                to: email, // Recipient email
                subject: 'Resend Verification Email',
                text: `You requested to resend your verification email. Please verify your account by clicking the following link: ${verificationUrl}`,
                html: `<p>You requested to resend your verification email.</p>
                    <p>Please verify your account by clicking the link below:</p>
                    <a href="${verificationUrl}">${verificationUrl}</a>`,
            };

            // Send the email
            await transporter.sendMail(mailOptions);
        }

        res.status(200).json({ message: 'Verification email resent successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to resend email.' });
    }
});

/**
 * Log out a user.
 */
router.post('/logout', authenticate, (req, res) => {
    res.status(200).json({ message: 'User logged out successfully.' });
});

/**
 * Request a password reset.
 */
router.post('/reset', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
        await user.save();

        // console.log(`Password reset link: http://your-frontend-url.com/reset/${resetToken}`);

        res.status(200).json({ message: 'Password reset link sent to email.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to send password reset link.' });
    }
});

/**
 * Reset password using a reset token.
 */
router.put('/reset/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findOne({ where: { resetToken: token, resetTokenExpiry: { [Op.gt]: Date.now() } } });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired token.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to reset password.' });
    }
});

/**
 * Get the logged-in user's profile.
 */
router.get('/profile', authenticate, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, { include: Organization });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.status(200).json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve profile.' });
    }
});

/**
 * Register a new user for the rewards program.
 */
router.post('/rewards/register', async (req, res) => {
    const { email, password, phone, fullName } = req.body;
    const { apikey: apiKey } = req.headers;

    if (!email || !password || !apiKey) {
        return res.status(400).json({ error: 'Email, password, and API key are required.' });
    }

    try {
        // Find the organization by API key
        const organization = await Organization.findOne({ where: { apiKey } });

        if (!organization) {
            return res.status(401).json({ error: 'Invalid API key.' });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ where: { email, organizationId: organization.id } });
        if (existingUser) {
            return res.status(400).json({ error: 'Invalid registration credentials.' });
        }

        // Generate the rewards ID (e.g., "R10003")
        const rewardsId = `R${Math.floor(10000 + Math.random() * 90000)}`;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Create the new rewards user with status as pending
        const newUser = await User.create({
            email,
            fullName,
            phone,
            password: hashedPassword,
            rewardsNumber: rewardsId,
            organizationId: organization.id,
            role: 'rewards_user',
            status: 'pending',
            verificationToken,
        });

        // Create a UserPoints record for the new user
        await UserPoints.create({
            userId: newUser.id,
            organizationId: organization.id,
            totalPoints: 0, // Initialize with 0 points
        });

        // Generate a JWT token for the newly created user
        const token = generateToken(newUser);

        // Set the token as a cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax', // For cross-domain cookies
            ...(process.env.NODE_ENV === 'production' && { domain: '.pizzalander.netlify.app' }),
            maxAge: 60 * 60 * 1000, // 1 hour
            path: '/',
        });

        // Send verification email
        const verificationUrl = `${process.env.API_BASE_URL}/auth/verify/${verificationToken}`;

        const transporter = process.env.NODE_ENV === 'development' ? {} : nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        if(process.env.NODE_ENV !== 'development') {
            const mailOptions = {
                from: 'jarvis@highplainsmedia.com',
                to: email,
                subject: 'Verify Your Account',
                text: `Welcome to our rewards program! Please verify your account by clicking the link: ${verificationUrl}`,
                html: `<p>Welcome to our rewards program!</p>
                    <p>Click the link below to verify your account:</p>
                    <a href="${verificationUrl}">${verificationUrl}</a>`,
            };

            await transporter.sendMail(mailOptions);
        } else {
            console.log(verificationUrl);
        }


        res.status(201).json({
            message: 'Rewards user registered successfully. Verification email sent!',
            user: {
                id: newUser.id,
                email: newUser.email,
                rewardsNumber: newUser.rewardsNumber,
                organizationId: newUser.organizationId,
                status: newUser.status,
            },
        });
    } catch (err) {
        console.error('Error registering rewards user:', err);
        res.status(500).json({ error: 'Failed to register rewards user.' });
    }
});

/**
 * Log in a rewards program user.
 */
router.post('/rewards/login', async (req, res) => {
    const { email, password } = req.body;
    const { apikey: apiKey } = req.headers;

    if (!email || !password || !apiKey) {
        return res.status(400).json({ error: 'Email, password, and API key are required.' });
    }

    try {
        // Find organization by API key
        const organization = await Organization.findOne({ where: { apiKey } });
        if (!organization) {
            return res.status(401).json({ error: 'Invalid API key.' });
        }

        // Find rewards user
        const user = await User.findOne({
            where: { email, organizationId: organization.id, role: 'rewards_user' }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Verify the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        // Generate JWT for the rewards user
        const token = generateToken(user);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            ...(process.env.NODE_ENV === 'production' && { domain: '.pizzalander.netlify.app' }),
            maxAge: 60 * 60 * 1000, // 1 hour
            path: '/',
        });

        res.status(200).json({
            message: 'Login successful.',
            token,
            user: {
                id: user.id,
                email: user.email,
                rewardsNumber: user.rewardsNumber,
                organizationId: user.organizationId,
            },
        });
    } catch (err) {
        console.error('Error logging in rewards user:', err);
        res.status(500).json({ error: 'Failed to log in rewards user.' });
    }
});

module.exports = router;
