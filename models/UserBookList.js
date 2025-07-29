const mongoose = require('mongoose');

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

module.exports = mongoose.model('UserBookList', bookListSchema)