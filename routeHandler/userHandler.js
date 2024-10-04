const express = require('express')
const router = express.Router()
const User = require('../schema/userSchema')
const verifyToken = require("../index")
const isAdmin = require('../index')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = process.env.ACCESS_TOKEN_SECRET;






// get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (err) {
        res.send('Error ' + err)
    }
})


// get trainers
router.get('/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email })
        res.json(user)
    } catch (err) {
        res.send('Error ' + err)
    }
})







module.exports = router;