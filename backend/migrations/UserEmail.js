const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function migrateUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Update existing users to have a default email value or set to null
        const result = await User.updateMany(
            { email: { $exists: false } }, // Find users without an email
            { $set: { email: "kylesspragg@gmail.com" } } // Set email to a default value
        );

        console.log(`Migration complete. Updated ${result.nModified} users.`);
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await mongoose.disconnect();
    }
}

migrateUsers().catch(err => console.error(err));