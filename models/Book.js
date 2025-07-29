const mongoose = require("mongoose")

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    yearOfPublication: {
        type: Number,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    BookImageUrl: String,
    averageRating: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('Book', bookSchema)
