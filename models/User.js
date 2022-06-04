const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    googleId: {
        type: String,
        require: true
    },
    displayName: {
        type: String,
        require: true
    },
    firstname: {
        type: String,
        require: true
    },
    lastname: {
        type: String,
        require: true
    },
    image: {
        type: String,
    },
    createAt: {
        type: String,
        default: Date.now
    }
})

module.exports = mongoose.model('User', UserSchema)