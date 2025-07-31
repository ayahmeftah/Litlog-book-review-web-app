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
        enum: [
            "Fantasy",
            "Science Fiction",
            "Mystery",
            "Horror",
            "Childerns",
            "Romance",
            "Non-Fiction",
            "Historical Fiction",
            "Adventure",
            "Young Adults"
        ],
        required: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    BookImage: String,
    BookImagePublicId: String,
    averageRating: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('Book', bookSchema)
