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
        console.log("Error fetching books:", error)
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
    console.log("Book creation error:", error)
    res.render("books/new.ejs", { error: "Something went wrong. Please try again." })
  }
})

router.get("/:id", async (req, res) => {
    try {
        const foundBook = await Book.findById(req.params.id).populate("authorId");
        let userBookList = null;
        if (req.session.user) {
            userBookList = await UserBookList.findOne({
                userId: req.session.user._id,
                bookId: foundBook._id,
            });
        }

        // In booksRoutes.js GET /:id
        let label = "Add to Shelf ▼";
        let btnClass = "btn-outline-secondary";

        if (userBookList?.status === "want to read") {
            label = "Want to Read ▼";
            btnClass = "btn-primary";
        } else if (userBookList?.status === "reading") {
            label = "Currently Reading ▼";
            btnClass = "btn-warning text-dark";
        } else if (userBookList?.status === "read") {
            label = "Read ▼";
            btnClass = "btn-success";
        }

        res.render("books/book-details.ejs", {
            foundBook,
            userBookList,
            user: req.session.user,
            label,
            btnClass
        });


    } catch (error) {
        console.log(error);
    }
})


module.exports = router