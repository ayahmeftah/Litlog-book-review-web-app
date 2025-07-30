const Book = require('../models/Book')
const router = require('express').Router()

router.get('/', async (req,res) =>{
    res.render('books/all-books.ejs')
})

router.get('/new', async (req,res) => {
    res.render('books/new.ejs')
})



module.exports = router