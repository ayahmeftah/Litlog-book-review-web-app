const Book = require('../models/Book')
const router = require('express').Router()
const setupMulter = require("../middleware/multer")
const upload = setupMulter()
const { requireLogin, requireAuthor } = require("../middleware/authMiddleware")

router.get('/', async (req, res) => {
    try {
        const books = await Book.find().populate("authorId")
        res.render("books/all-books.ejs", { books })
    } catch (error) {
        console.error("Error fetching books:", error)
        res.render("books/all-books.ejs", { books: [] })
    }
})

router.get('/new', requireAuthor ,async (req, res) => {
    res.render('books/new.ejs', {error : null})
})

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
    })

    await newBook.save()
    res.redirect("/books")
  } catch (error) {
    console.error("Book creation error:", error)
    res.render("books/new.ejs", { error: "Something went wrong. Please try again." })
  }
});




module.exports = router