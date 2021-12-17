const mongoose = require("mongoose")
const User = require('./userModel')

const ReviewSchema = new mongoose.Schema({
    body: String,
    rating: Number,
    date: { 
        type: Date, 
        default: Date.now
    },
    usersVoted: 
    [
        { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        }
    ],
    reviewPoints: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})



module.exports = mongoose.model('Review', ReviewSchema)



