const User = require("../models/User")
const router = require("express").Router()
const { requireLogin, requireAuthor } = require("../middleware/authMiddleware")
const setupMulter = require("../middleware/multer")
const uploadBookCover = setupMulter("profile-pictures")

router.get("/profile", requireLogin, async (req, res) => {
  const user = await User.findById(req.session.user._id)
  const totalBooks = user.bookList.length

  res.render("users/profile.ejs", {user,totalBooks})
})



module.exports = router