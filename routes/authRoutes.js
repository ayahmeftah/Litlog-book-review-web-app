const User = require("../models/User")
const router = require("express").Router()
const bcrypt = require("bcrypt")

router.get('/sign-up', async (req,res)=>{
    res.render("auth/sign-up.ejs")
})







module.exports = router