const User = require("../models/User")
const router = require("express").Router()
const bcrypt = require("bcrypt")

router.get('/sign-up', async (req,res)=>{
    res.render("auth/sign-up.ejs",{ errorMessages: null})
})

router.post("/sign-up", async (req, res) => {
  try {
    const { name, username, email, password, role } = req.body

    const errorMessages = {}

    if (!name) errorMessages.name = "Name is required."
    if (!username) errorMessages.username = "Username is required."
    if (!email) errorMessages.email = "Email is required."
    if (!role) errorMessages.role = "Role is required."

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (email && !emailRegex.test(email)) {
      errorMessages.email = "Please enter a valid email."
    }

    
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      if (existingUser.username === username) {
        errorMessages.username = "Username is already taken."
      }
      if (existingUser.email === email) {
        errorMessages.email = "Email is already in use."
      }
    }

    
    if (errorMessages.name || errorMessages.username || errorMessages.email || errorMessages.role) {
     res.render("auth/sign-up.ejs", {
        errorMessages
      })
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    await User.create({
      name,
      username,
      email,
      role,
      password: hashedPassword
    })

    res.redirect("/auth/login");

  } catch (error) {
    console.error("Signup error:", error);
    res.render("auth/sign-up.ejs", {
      errorMessages: { general: "Something went wrong. Please try again." }
    });
  }
});







module.exports = router