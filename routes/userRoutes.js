const User = require("../models/User")
const router = require("express").Router()
const { requireLogin, requireAuthor } = require("../middleware/authMiddleware")
const setupMulter = require("../middleware/multer")
const uploadBookCover = setupMulter("profile-pictures")

router.get("/profile", requireLogin, async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id)
        const totalBooks = user.bookList.length

        res.render("users/profile.ejs", { user, totalBooks })

    } catch (error) {
        console.log("Get profile error:", error)
        res.redirect("/books")
    }
})

router.get("/profile/edit", requireLogin, async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id)
        res.render("users/edit-profile.ejs", { user, error: null })

    } catch (error) {
        console.log("Get edit profile error:", error)
        res.redirect("/users")
    }
})



module.exports = router