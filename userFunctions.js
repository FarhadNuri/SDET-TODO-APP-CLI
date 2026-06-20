import { User } from './db.js';


function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


async function registerUser(name, email, password) {
    if (!name || name.trim() === '') {
        console.log('----------------------');
        console.log('Name cannot be empty.');
        console.log('----------------------');
        return null;
    }

    if (!isValidEmail(email)) {
        console.log('----------------------');
        console.log('Invalid email format.');
        console.log('----------------------');
        return null;
    }

    if (password.length < 4) {
        console.log('---------------------------------------');
        console.log('Password must be at least 4 characters.');
        console.log('---------------------------------------');
        return null;
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        console.log('---------------------');
        console.log('Email already exists.');
        console.log('---------------------');
        return null;
    }

    const user = await User.create({
        name,
        email,
        password
    });
    console.log('------------------------');
    console.log('Registration successful!');
    console.log('------------------------');
    return user;
}


async function loginUser(email, password) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
        console.log('--------------------------');
        console.log('Invalid email or password.');
        console.log('--------------------------');
        return null;
    }

    if (user.password !== password) {
        console.log('----------------');
        console.log('Wrong credential');
        console.log('----------------');
        return null;
    }
    console.log('------------------');
    console.log('Login successful!');
    console.log('------------------');

    return user;
}

export { registerUser, loginUser };
