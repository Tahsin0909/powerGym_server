const express = require('express')
const router = express.Router()
const tips = require('../schema/tipsSchema')
const verifyToken =require("../index")


// get all tips
router.get('/',  async (req, res) => {
    try {
        const users = await tips.find()
        res.json(users)
    } catch(err) {
        res.send('Error ' + err)
    }
}) 

router.patch('/like/:id', async(req,res) =>{

    try{
        const Tips = await tips.findById(req.params.id);
        if( Tips.likes.indexOf(req.body.email) > -1){
            Tips.likes = Tips.likes.filter(email => email !== req.body.email); 
        } else {
            Tips.likes.push(req.body.email);
        }
        
        const updatedBlog = await Tips.save();
        res.json(updatedBlog);
    } catch(err){
        res.status(500).json({message: err.message})
    }
})




module.exports = router;