const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

const createAdmin = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        const adminPassword = await bcrypt.hash('the1stCodeler!', 10);
        
        const admin = new User({
            username: 'kylespragg',
            password: adminPassword,
            role: 'admin'
        });

        await admin.save();
        console.log('Admin user created successfully');
        console.log('Username:', admin.username);
        console.log('Role:', admin.role);

    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    }
};

createAdmin();