const Book = require('../models/Book')
const router = require('express').Router()
const setupMulter = require("../middleware/multer")
const upload = setupMulter()
const { requireLogin, requireAuthor } = require("../middleware/authMiddleware")
const UserBookList = require("../models/UserBookList")
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
        let userBookList = null
        if (req.session.user) {
            const user = await User.findById(req.session.user._id);
            userBookList = user.bookList.find(
                entry => entry.bookId.toString() === foundBook._id.toString()
            )
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
            btnClass
        })


    } catch (error) {
        console.log("Get Book details error:",error)
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

        await Book.findByIdAndDelete(req.params.id)

        res.redirect("/books")
    } catch (error) {
        console.log("Delete book error:", error)
        res.redirect("/books")
    }
})

// Get to get the editing book view
router.get("/:id/edit", requireAuthor, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)

        if (!book) return res.redirect("/books")

        res.render("books/edit.ejs", { book, error: null })
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

        if (!foundBook){
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


module.exports = router