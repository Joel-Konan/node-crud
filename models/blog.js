const mongoose = require('../data/bd');

const blog = mongoose.Schema({
    title: {
        type: String
    },

    description: {
        type: String
    },

    image: {
        type: String
    }
}, { timestamps: true })

module.exports = mongoose.model('blogs', blog);