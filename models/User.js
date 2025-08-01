const mongoose = require("mongoose")

const bookListSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  status: {
    type: String,
    enum: ['want to read', 'reading', 'read'],
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
})

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['author', 'reader'],
        required: true
    },
    bookList: [bookListSchema],
    profilePic: { 
      type: String, 
      default: "/images/default-profile-img.jpg" 
    }
})

module.exports = mongoose.model('User', userSchema)