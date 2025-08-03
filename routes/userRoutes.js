const User = require("../models/User")
const Review = require("../models/Review")
const Book = require("../models/Book")
const router = require("express").Router()
const { requireLogin, requireAuthor } = require("../middleware/authMiddleware")
const setupMulter = require("../middleware/multer")
const uploadProfilePic = setupMulter("profile-pictures")
const bcrypt = require("bcrypt")
const cloudinary = require("cloudinary").v2

router.get("/profile", requireLogin, async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id)

        const bookList = user.bookList || []

        const statusCounts = {
            reading: 0,
            completed: 0,
            wishlist: 0
        }

        for (let item of bookList) {
            const status = item.status?.toLowerCase()
            if (statusCounts[status] !== undefined) {
                statusCounts[status]++
            }
        }
        const totalBooks = bookList.length
        res.render("users/profile.ejs", { user, totalBooks, statusCounts })

    } catch (error) {
        console.log("Get profile error:", error)
        res.redirect("/books")
    }
})

router.get("/profile/edit", requireLogin, async (req, res) => {
    const user = await User.findById(req.session.user._id)
    res.render("users/edit-profile.ejs", { user, errorMessages: null, passwordErrors: [] })
})

router.put("/profile/edit", requireLogin, uploadProfilePic.single("profilePic"), async (req, res) => {
    try {
        const { name, username, email, currentPassword, newPassword, removePic } = req.body
        const user = await User.findById(req.session.user._id)

        const errorMessages = {}
        const passwordErrors = []

        if (!name) {
            errorMessages.name = "Name is required."
        }
        if (!username) {
            errorMessages.username = "Username is required."
        }
        if (!email) {
            errorMessages.email = "Email is required."
        }

        const availableUser = await User.findOne({ username })
        const availableEmail = await User.findOne({ email })

        if (availableUser && availableUser._id.toString() !== user._id.toString()) {
            errorMessages.username = "Username is already taken."
        }

        if (availableEmail && availableEmail._id.toString() !== user._id.toString()) {
            errorMessages.email = "Email is already in use."
        }


        if (newPassword) {
            const match = await bcrypt.compare(currentPassword, user.password)

            if (!match) {
                errorMessages.currentPassword = "Current password is incorrect."
            } else {
                const noWhiteSpace = /^\S*$/
                if (!noWhiteSpace.test(newPassword)) {
                    passwordErrors.push("Password must not contain whitespaces.")
                }

                const hasUpper = /^(?=.*[A-Z]).*$/
                if (!hasUpper.test(newPassword)) {
                    passwordErrors.push("Password must have at least one uppercase letter.")
                }

                const hasLower = /^(?=.*[a-z]).*$/
                if (!hasLower.test(newPassword)) {
                    passwordErrors.push("Password must have at least one lowercase letter.")
                }

                const hasDigit = /^(?=.*[0-9]).*$/
                if (!hasDigit.test(newPassword)) {
                    passwordErrors.push("Password must contain at least one digit.")
                }

                const hasSpecial = /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/
                if (!hasSpecial.test(newPassword)) {
                    passwordErrors.push("Password must contain at least one special character.")
                }

                const validLength = /^.{8,16}$/
                if (!validLength.test(newPassword)) {
                    passwordErrors.push("Password must be 8–16 characters long.")
                }
            }
        }

        if (errorMessages.name || errorMessages.username || errorMessages.email || errorMessages.currentPassword || passwordErrors.length > 0) {

            return res.render("users/edit-profile.ejs", { user, errorMessages, passwordErrors })
        }

        user.name = name
        user.username = username
        user.email = email

        if (newPassword) {
            user.password = await bcrypt.hash(newPassword, 10)
        }

        const isCustomPic = user.profilePic && !user.profilePic.includes("default-profile-img.jpg")

        if (removePic === "true" && isCustomPic) {
            if (user.profilePicPublicId) {
                await cloudinary.uploader.destroy(user.profilePicPublicId)
            }
            user.profilePic = "/images/default-profile-img.jpg"
            user.profilePicPublicId = null
        }

        if (req.file) {
            if (isCustomPic) {
                const oldId = user.profilePicPublicId
                if (oldId) {
                    await cloudinary.uploader.destroy(oldId)
                }
            }
            user.profilePic = req.file.path
            user.profilePicPublicId = req.file.filename
        }

        await user.save()
        res.redirect("/users/profile")

    } catch (error) {
        console.log("Edit profile error:", error)
        res.redirect("/users/profile")
    }
})

router.get("/my-reviews", requireLogin, async (req, res) => {

    try {
        const userReviews = await Review.find({ userId: req.session.user._id }).populate("bookId").sort({ createdAt: -1 })
        const user = req.session.user.username
        res.render("users/my-reviews.ejs", { userReviews, user })
    } catch (error) {
        console.log("Get user reviews error:", error)
        res.render("users/profile.ejs")
    }

})

router.get("/my-bookshelves", requireLogin, async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id).populate({ path: "bookList.bookId", populate: { path: "authorId" } })

        res.render("users/bookshelves.ejs", { user, books: user.bookList })
    } catch (error) {
        console.log("Get user bookshelves error:", error)
        res.render("users/profile.ejs")
    }

})

router.get("/my-bookshelves/:status", requireLogin, async (req, res) => {

    try {
        const status = req.params.status
        const user = await User.findById(req.session.user._id).populate({ path: "bookList.bookId", populate: { path: "authorId" } })

        const filtered = user.bookList.filter(b => b.status === status)

        res.render("users/bookshelf-filter.ejs", { user, books: filtered, status })
    } catch (error) {
        console.log("Get user filtered bookshelves error:", error)
        res.render("users/profile.ejs")
    }

})

router.get("/my-books", requireLogin, async (req, res) => {

    try {
        const user = await User.findById(req.session.user._id)

        if (user.role !== "author") {
            return res.redirect("/users/profile")
        }

        const books = await Book.find({ authorId: user._id })

        res.render("users/my-books.ejs", { books })
    } catch (error) {
        console.log("Get author books error:", error)
        res.render("users/profile.ejs")
    }

})

router.delete("/delete-account", requireLogin, async (req, res) => {
    try {

        const userId = req.session.user._id
        const user = await User.findById(userId)

        if (!user) {
            return res.redirect("/books")
        }

        if (user.profilePicPublicId) {
            await cloudinary.uploader.destroy(user.profilePicPublicId)
        }

        const booksByUser = await Book.find({ authorId: userId })

        for (const book of booksByUser) {

            if (book.BookImagePublicId) {
                await cloudinary.uploader.destroy(book.BookImagePublicId)
            }

            await Review.deleteMany({ bookId: book._id })

            const allUsers = await User.find({})

            for (const u of allUsers) {
                u.bookList = u.bookList.filter(entry =>
                    entry.bookId && entry.bookId.toString() !== book._id.toString()
                )
                await u.save()
            }
        }

        await Book.deleteMany({ authorId: userId })

        await Review.deleteMany({ userId: userId })

        const allUsersAgain = await User.find({})

        for (const u of allUsersAgain) {
            u.bookList = u.bookList.filter(entry => {
                entry.userId && entry.userId.toString() !== userId.toString()

            })
            await u.save()
        }

        await User.findByIdAndDelete(userId)

        req.session.destroy(() => {
            res.redirect("/books")
        })

    } catch (error) {
        console.error("Error deleting user account:", error)
        res.redirect("/users/profile")
    }
})


module.exports = router