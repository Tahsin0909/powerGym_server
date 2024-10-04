const express = require('express')
const router = express.Router()
const User = require('../schema/userSchema')
const verifyToken =require("../index")
const isAdmin = require('../index')



// post a user
router.post('/', async (req, res) => {
    const user = new User(req.body)
    console.log(user)

    try {
        const newUser =  await user.save() 
        res.json(newUser)
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
})

// get all users
router.get('/',verifyToken,isAdmin,  async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch(err) {
        res.send('Error ' + err)
    }
}) 


// get trainers
router.get('/:email',verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email })
        res.json(user)
    } catch(err) {
        res.send('Error ' + err)
    }
})







module.exports = router;