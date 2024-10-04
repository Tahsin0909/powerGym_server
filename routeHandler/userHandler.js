const express = require('express')
const router = express.Router()
const User = require('../schema/userSchema')
const verifyToken =require("../index")
// get all users
router.get('/',verifyToken, async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch(err) {
        res.send('Error ' + err)
    }
}) 

// get a user
router.get('/:email',verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email })
        res.json(user)
    } catch(err) {
        res.send('Error ' + err)
    }
})
router.patch('/admin/:id',verifyToken, async(req,res)=>{
    try{
        const id = req.params.id;
    
      
      const updatedDoc = {
        $set:{
          isAdmin :true
        }
      }
      const result = await User.findByIdAndUpdate(id,updatedDoc);
      res.send(result);
      
  
    }
    catch (error) {
      res.status(500).send({ error: 'An error occurred', message: error.message });
    }
   });
router.get('/admin/:email',verifyToken,  async (req, res) => {
    const email = req.params.email;
    
    const query = { email: email }
    const user = await User.findOne(query)
    let isAdmin = false;
    if (user) {
        isAdmin = user?.isAdmin === true;
    }
    res.send({isAdmin})
    console.log(isAdmin);
  });


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



module.exports = router;