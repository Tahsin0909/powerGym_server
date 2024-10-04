const express = require('express')
const router = express.Router()
const User = require('../schema/userSchema')
const verifyToken = require("../index")
const isAdmin = require('../index')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = process.env.ACCESS_TOKEN_SECRET;



router.post('/', async (req, res) => {
    const { name, email, password, role } = req.body; // Destructure name, email, password, and role from the request body

    // Validate required fields
    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Name, email, password, and role are required' });
    }

    // Create a new user object
    const user = new User({ name, email, password, role }); // Include role

    // Hash the password before saving
    try {
        const salt = await bcrypt.genSalt(10); // Generate salt
        user.password = await bcrypt.hash(password, salt); // Hash the password

        const newUser = await user.save(); // Save the user to the database
        // creating token and send to client
        const userData = req.body
        const token = jwt.sign(userData, secret, { expiresIn: 60 * 60 })



        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        }).status(201).json({ success: true, statusCode: 201, message: 'User added successfully' });


    } catch (err) {
        // Handle duplicate email error
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: err.message });
    }
});


// get all users
router.get('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (err) {
        res.send('Error ' + err)
    }
})


// get trainers
router.get('/:email', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email })
        res.json(user)
    } catch (err) {
        res.send('Error ' + err)
    }
})







module.exports = router;