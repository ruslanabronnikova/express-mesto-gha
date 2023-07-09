const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlenth: 2
    },
    avatar: {
        type: String,
        minlenth: 2
    },
    email:{
        type: String,
        required: true,
        minlenth: 5
    }
})

const User = mongoose.model('user', userSchema);

module.exports = User;