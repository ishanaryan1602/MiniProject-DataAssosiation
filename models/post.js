const mongoose = require('mongoose');

const postShcema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date:{
        type: Date,
        default: Date.now()
    },
    content : String,
    likes : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
},
{timestamps: true}
);

module.exports = mongoose.model('Post', postShcema);