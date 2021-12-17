const mongoose = require("mongoose")
const Review = require("./reviewModel")
const passportlocalMongoose = require('passport-local-mongoose')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        lowercase: true, 
        required: true,
        unique: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    firstname: {
        type: String,
        lowercase: true, 
        required: true
    },
    lastname: {
        type: String,
        lowercase: true, 
        required: true
    },
    date: { 
        type: Date, 
        default: Date.now
    },
    userReviews: 
    [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book'
        }
    ]
})


var options = {
    errorMessages: {
        MissingPasswordError: 'No password was given',
        AttemptTooSoonError: 'Account is currently locked. Try again later',
        TooManyAttemptsError: 'Account locked due to too many failed login attempts',
        NoSaltValueStoredError: 'Authentication not possible. No salt value stored',
        IncorrectPasswordError: 'Password or username are incorrect',
        IncorrectUsernameError: 'Password or username are incorrect',
        MissingUsernameError: 'No username was given',
        UserExistsError: 'A user with the given username is already registered'
    }
};

UserSchema.plugin(passportlocalMongoose, options)
module.exports = mongoose.model('User', UserSchema)