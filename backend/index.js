import express from 'express';
import connectDB from './database/db.js';
import User from './models/user.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/register', async (req, res) => {
    try {
        // get all the data from the frontend
        const { firstName, lastName, email, username, password } = req.body;
        console.log(firstName, lastName, email, username, password);

        // check if all fields are provided
        if (!firstName || !lastName || !email || !username || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // check if username is already taken
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already taken', message: 'Please try a different username' });
        }

        // hashing/encrypt the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // save the user in the db
        const newUser = await User.create({ firstName, lastName, email, username, password: hashedPassword });

        // generate a token for user and send it
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        newUser.token = token;
        await newUser.save();
        newUser.password = undefined;
        
        res.status(201).json({ token, message: 'User created successfully', user: newUser });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

