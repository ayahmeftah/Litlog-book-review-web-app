const Book = require('../models/Book')
const router = require('express').Router()
const setupMulter = require("../middleware/multer")
const upload = setupMulter()
const { requireLogin, requireAuthor } = require("../middleware/authMiddleware")
const cloudinary = require("../config/cloudinary")
const User = require("../models/User")
const Review = require("../models/Review")

// Get all books
router.get('/', async (req, res) => {
    try {
        const books = await Book.find().populate("authorId")
        res.render("books/all-books.ejs", { books })
    } catch (error) {
        console.log("Error fetching books:", error)
        res.render("books/all-books.ejs", { books: [] })
    }
})

// Get form to create new book
router.get('/new', requireAuthor, async (req, res) => {
    res.render('books/new.ejs', { error: null })
})

// Post to create book
router.post("/", requireAuthor, upload.single("bookImage"), async (req, res) => {
    try {
        const { title, description, yearOfPublication, genre } = req.body;

        if (!title || !description || !yearOfPublication || !genre) {
            return res.render("books/new.ejs", { error: "All fields are required." })
        }

        const newBook = new Book({
            title,
            description,
            yearOfPublication,
            genre,
            authorId: req.session.user._id,
            BookImage: req.file?.path || null,
            BookImagePublicId: req.file?.filename || null
        })

        await newBook.save()
        res.redirect("/books")
    } catch (error) {
        console.log("Book creation error:", error)
        res.render("books/new.ejs", { error: "Something went wrong. Please try again." })
    }
})

// Get the book details
router.get("/:id", async (req, res) => {
    try {
        const foundBook = await Book.findById(req.params.id).populate("authorId")

        const reviews = await Review.find({ bookId: foundBook._id }).populate("userId").limit(3)

        let userBookList = null
        let userReview = null

        if (req.session.user) {
            const user = await User.findById(req.session.user._id);
            userBookList = user.bookList.find(
                entry => entry.bookId.toString() === foundBook._id.toString()
            )

            userReview = await Review.findOne({
                bookId: foundBook._id,
                userId: req.session.user._id,
            })
        }

        let label = "Add to Shelf ▼"
        let btnClass = "btn-outline-secondary"

        if (userBookList?.status === "want to read") {
            label = "Want to Read ▼"
            btnClass = "btn-primary"
        } else if (userBookList?.status === "reading") {
            label = "Currently Reading ▼"
            btnClass = "btn-warning text-dark"
        } else if (userBookList?.status === "read") {
            label = "Read ▼"
            btnClass = "btn-success"
        }

        res.render("books/book-details.ejs", {
            foundBook,
            userBookList,
            user: req.session.user,
            label,
            btnClass,
            reviews,
            userReview
        })


    } catch (error) {
        console.log("Get Book details error:", error)
        res.redirect("/books")
    }
})

// Delete to delete book
router.delete('/:id', requireAuthor, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)

        if (!book) {
            return res.redirect("/books")
        }

        if (book.BookImagePublicId) {
            await cloudinary.uploader.destroy(book.BookImagePublicId)
        }

        await Review.deleteMany({ bookId: book._id })
        await Book.findByIdAndDelete(book._id)

        res.redirect("/books")
    } catch (error) {
        console.log("Delete book error:", error)
        res.redirect("/books")
    }
})

// Get to get the editing book view
router.get("/:id/edit", requireAuthor, async (req, res) => {
    try {

        const genres = ["Fantasy", "Science Fiction", "Mystery", "Horror", "Childerns", "Romance", "Non-Fiction", "Historical Fiction", "Adventure", "Young Adults"]

        const book = await Book.findById(req.params.id)

        if (!book) return res.redirect("/books")

        res.render("books/edit.ejs", { book, error: null, genres })
    } catch (error) {
        console.log("Edit GET error:", error)
        res.redirect("/books")
    }
})

// Put to save book details changes
router.put("/:id", requireAuthor, upload.single("bookImage"), async (req, res) => {
    try {
        const { title, description, yearOfPublication, genre } = req.body
        const foundBook = await Book.findById(req.params.id)

        if (!foundBook) {
            return res.redirect("/books")
        }

        if (req.file) {
            if (foundBook.BookImagePublicId) {
                await cloudinary.uploader.destroy(foundBook.BookImagePublicId);
            }

            foundBook.BookImage = req.file.path;
            foundBook.BookImagePublicId = req.file.filename;
        }

        foundBook.title = title
        foundBook.description = description
        foundBook.yearOfPublication = yearOfPublication
        foundBook.genre = genre

        await foundBook.save()

        res.redirect(`/books/${foundBook._id}`)
    } catch (error) {
        console.log("Update book error:", error)
        res.redirect("/books")
    }
})

router.post("/:id/shelf", requireLogin, async (req, res) => {
    try {
        const { status } = req.body
        const bookId = req.params.id
        const user = await User.findById(req.session.user._id)

        if (!user) {
            return res.redirect("/login")
        }

        const existingIndex = user.bookList.findIndex(
            entry => entry.bookId.toString() === bookId.toString()
        )

        if (status === "remove") {
            if (existingIndex !== -1) {
                user.bookList.splice(existingIndex, 1)
            }

            await Review.findOneAndDelete({ bookId, userId: req.session.user._id })
            const remaining = await Review.find({ bookId })

            let total = 0
            for (let i = 0; i < remaining.length; i++) {
                total += remaining[i].rating
            }
            const avg = remaining.length > 0 ? total / remaining.length : 0;
            await Book.findByIdAndUpdate(bookId, { averageRating: avg })

        } else {
            if (existingIndex !== -1) {
                user.bookList[existingIndex].status = status
            } else {
                user.bookList.push({ bookId, userId: user._id, status })
            }

            if (status === "want to read") {

                await Review.findOneAndDelete({ bookId, userId: req.session.user._id })
                const remaining = await Review.find({ bookId })

                let total = 0
                for (let i = 0; i < remaining.length; i++) {
                    total += remaining[i].rating
                }
                const avg = remaining.length > 0 ? total / remaining.length : 0;
                await Book.findByIdAndUpdate(bookId, { averageRating: avg })
            }
        }
        await user.save()
        res.redirect(`/books/${bookId}`)
    } catch (error) {
        console.error("Shelf update error:", error)
        res.redirect(`/books/${req.params.id}`)
    }
})


// Get for viewing all the reviews of a certian book
router.get("/:id/reviews", async (req, res) => {
    try {
        const bookId = req.params.id
        const foundBook = await Book.findById(bookId)
        const reviews = await Review.find({ bookId }).populate("userId").sort({ createdAt: -1 })

        res.render("reviews/all-reviews.ejs", { foundBook, reviews, user: req.session.user })

    } catch (error) {
        console.log("Get all reviews for book error:", error)
        res.redirect(`/books/${req.params.id}`)
    }
})


router.post("/:id/reviews", requireLogin, async (req, res) => {
    try {
        const { rating, comment } = req.body
        const bookId = req.params.id

        const existingReview = await Review.findOne({ bookId, userId: req.session.user._id})

        if (existingReview) {
            return res.redirect(`/books/${bookId}`)
        }

        const newReview = new Review({
            bookId,
            userId: req.session.user._id,
            rating,
            comment
        })

        await newReview.save()

        const reviews = await Review.find({ bookId })
        let total = 0
        for (let i = 0; i < reviews.length; i++) {
            total += reviews[i].rating
        }
        const avg = reviews.length > 0 ? total / reviews.length : 0

        res.redirect(`/books/${bookId}`)
    } catch (error) {
        console.log("Add review error:", error)
        res.redirect(`/books/${req.params.id}`)
    }
})

// PUT edit review
router.put("/:id/reviews/:reviewId", requireLogin, async (req, res) => {
    try {
        const { rating, comment } = req.body
        const review = await Review.findById(req.params.reviewId)

        if (!review || review.userId.toString() !== req.session.user._id.toString()) {
            return res.send("Not allowed")
        }

        review.rating = rating
        review.comment = comment
        await review.save()

        const reviews = await Review.find({ bookId: req.params.id })
        let total = 0
        for (let i = 0; i < reviews.length; i++) {
            total += reviews[i].rating
        }
        const avg = reviews.length > 0 ? total / reviews.length : 0

        res.redirect(`/books/${req.params.id}`)
    } catch (error) {
        console.log("Edit review error:", error)
        res.redirect(`/books/${req.params.id}`)
    }
})

// DELETE review
router.delete("/:id/reviews/:reviewId", requireLogin, async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId)

        if (!review || review.userId.toString() !== req.session.user._id.toString()) {
            return res.send("Not allowed")
        }

        await Review.findByIdAndDelete(req.params.reviewId)

        const reviews = await Review.find({ bookId: req.params.id })
        let total = 0
        for (let i = 0; i < reviews.length; i++) {
            total += reviews[i].rating
        }
        const avg = reviews.length > 0 ? total / reviews.length : 0;

        await Book.findByIdAndUpdate(req.params.id, { averageRating: avg })

        res.redirect(`/books/${req.params.id}`)
    } catch (error) {
        console.log("Delete review error:", error)
        res.redirect(`/books/${req.params.id}`)
    }
})


module.exports = router