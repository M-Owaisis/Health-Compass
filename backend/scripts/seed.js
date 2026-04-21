const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://mongodb:27017/healthcompass').then(async () => {
    try {
        await User.deleteMany({ email: 'test@healthcompass.com' });
        const user = new User({
            name: 'Test Setup User',
            email: 'test@healthcompass.com',
            password: 'Password123!',
            isEmailVerified: true,
            accountStatus: 'active'
        });
        await user.save();
        console.log('SUCCESS: Seed user created!');
    } catch(err) {
        console.log('ERROR:', err);
    }
    process.exit(0);
}).catch(e => {
    console.log('MONGO ERR:', e);
    process.exit(1);
});
