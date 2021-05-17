const mongoose = require('../data/bd');

const user = mongoose.Schema({
    nom: {
        type: String,
        required: true
    },

    prenom: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('users', user);