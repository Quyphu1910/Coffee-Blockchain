const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        immutable: true, 
        description: 'MetaMask wallet address (unique user identifier)',
    },
    username: {
        type: String,
        trim: true,
        maxLength: 50,
        description: 'Display name for the user',
    },
    firstName: {
        type: String,
        trim: true,
        maxLength: 50,
        description: 'User\'s first name',
    },
    lastName: {
        type: String,
        trim: true,
        maxLength: 50,
        description: 'User\'s last name',
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        description: 'User\'s email address',
            },
    phoneNumber: {
        type: String,
        trim: true,
        description: 'User\'s phone number',
        
    },
    profileImageUri: {
        type: String,
        trim: true,
        description: 'URL to the user\'s profile image',
    },
    bio: {
        type: String,
        trim: true,
        maxLength: 200,
        description: 'Short biography or description of the user',
    },
    location: {
        type: String,
        trim: true,
        description: 'User\'s location (e.g., city, country)',
    },
    websiteUrl: {
        type: String,
        trim: true,
        description: 'User\'s personal website URL',
    },
    password: { 
        type: String,
        minlength: 6,
        description: 'Password for password-based login (optional)',
    },
    isVerified: {
        type: Boolean,
        default: false,
        description: 'Indicates if the user\'s account is verified (e.g., email verification)',
    },
    isActive: {
        type: Boolean,
        default: true,
        description: 'Indicates if the user account is active',
    },
    registrationDate: {
        type: Date,
        default: Date.now,
        description: 'Date when the user registered',
    },
    lastLogin: {
        type: Date,
        description: 'Date of the user\'s last login',
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'staff'],
        default: 'user',
        description: 'User role (user, admin, staff, etc.)',
    },
    preferences: { 
        darkMode: { type: Boolean, default: false, description: 'User preference for dark mode' },
        emailNotifications: { type: Boolean, default: true, description: 'User preference for email notifications' },

    },
    socialLinks: { 
        facebook: { type: String, trim: true, description: 'Facebook profile URL' },
        twitter: { type: String, trim: true, description: 'Twitter profile URL' },
        instagram: { type: String, trim: true, description: 'Instagram profile URL' },
        linkedin: { type: String, trim: true, description: 'LinkedIn profile URL' },
    },

}, { timestamps: true, collection: 'users' }); 

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        return next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = mongoose.model('User', userSchema);