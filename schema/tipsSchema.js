const mongoose = require('mongoose');


const tipsSchema = new mongoose.Schema({
    category : {
        type: String, 
    },
    tips : {
        type: String, 
    },
    likes : {
        type: Array, 
    },
    category : {
        type: String, 
    },
    tips : {
        type: String, 
    },

    likes : {
        type: Array, 
    },
})


module.exports = mongoose.model('tips', tipsSchema);