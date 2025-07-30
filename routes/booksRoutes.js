const Book = require('../models/Book')
const router = require('express').Router()

router.get('/', async (req,res) =>{
    res.render('books/all-books.ejs')
})




module.exports = router