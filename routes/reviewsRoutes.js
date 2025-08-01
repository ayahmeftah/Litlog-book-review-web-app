const express = require("express")
const router = express.Router()
const Review = require("../models/Review")
const Book = require("../models/Book")
const User = require("../models/User")
const { requireLogin, requireAuthor } = require("../middleware/authMiddleware")

// Post to Add Review
router.post("/:bookId", requireLogin, async (req, res) => {
    try {
        const { rating, comment } = req.body
        const bookId = req.params.bookId
        const userId = req.session.user._id

        const existingReview = await Review.findOne({ bookId, userId })

        if (existingReview) {
            return res.send("You already reviewed this book")
        }

        const review = new Review({ bookId, userId, rating, comment })
        await review.save()

        const reviews = await Review.find({ bookId })

        let sum = 0
        for (let r of reviews) {
            sum += r.rating
        }
        const averageRating = reviews.length > 0 ? sum / reviews.length : 0
        await Book.findByIdAndUpdate(bookId, { averageRating: averageRating })

        res.redirect(`/books/${bookId}`)
    } catch (error) {
        console.log("Review add error:", err)
        res.redirect(`/books/${req.params.bookId}`)
    }
})




module.exports = router