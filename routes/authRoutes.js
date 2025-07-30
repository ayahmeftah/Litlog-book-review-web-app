const User = require("../models/User")
const router = require("express").Router()
const bcrypt = require("bcrypt")

router.get('/sign-up', async (req,res)=>{
    res.render("auth/sign-up.ejs",{ errorMessages: null, passwordErrors: [] })
})

router.post("/sign-up", async (req, res) => {
  try {
    const { name, username, email, password, role } = req.body

    const errorMessages = {}
    const passwordErrors = []

    if (!name) errorMessages.name = "Name is required."
    if (!username) errorMessages.username = "Username is required."
    if (!email) errorMessages.email = "Email is required."
    if (!password) passwordErrors.push("Password is required.")
    if (!role) errorMessages.role = "Role is required."

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (email && !emailRegex.test(email)) {
      errorMessages.email = "Please enter a valid email."
    }

    // Password Requirements (From Stack Overflow: https://stackoverflow.com/questions/12090077/javascript-regular-expression-password-validation-having-special-characters )
    if (password) {
      const noWhiteSpace = /^\S*$/
      if (!noWhiteSpace.test(password)) {
        passwordErrors.push("Password must not contain whitespaces.")
      }

      const hasUpper = /^(?=.*[A-Z]).*$/
      if (!hasUpper.test(password)) {
        passwordErrors.push("Password must have at least one uppercase letter.")
      }

      const hasLower = /^(?=.*[a-z]).*$/
      if (!hasLower.test(password)) {
        passwordErrors.push("Password must have at least one lowercase letter.")
      }

      const hasDigit = /^(?=.*[0-9]).*$/
      if (!hasDigit.test(password)) {
        passwordErrors.push("Password must contain at least one digit.")
      }

      const hasSpecial = /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/
      if (!hasSpecial.test(password)) {
        passwordErrors.push("Password must contain at least one special character.")
      }

      const validLength = /^.{8,16}$/
      if (!validLength.test(password)) {
        passwordErrors.push("Password must be 8–16 characters long.")
      }
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

    
    if (errorMessages.name || errorMessages.username || errorMessages.email || errorMessages.role || passwordErrors.length > 0) {
     return res.render("auth/sign-up.ejs", {
        errorMessages,
        passwordErrors
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

    return res.redirect("/books");

  } catch (error) {
    console.log("Signup error:", error);
    res.render("auth/sign-up.ejs", {
      errorMessages: { general: "Something went wrong. Please try again." },
      passwordErrors: []
    });
  }
});


router.get("/login", (req, res) => {
  res.render("auth/login.ejs",{errorMessages: null})
})

router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body
    const errorMessages = {}

    if (!identifier || !password) {
      errorMessages.general = "Both fields are required."

      return res.render("auth/login.ejs", { errorMessages })
    }

    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    })

    if (!user) {
      errorMessages.identifier = "No user found with that username or email."
      return res.render("auth/login.ejs", { errorMessages })
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password)
    if (!passwordIsValid) {
      errorMessages.password = "Incorrect password."
      return res.render("auth/login.ejs", { errorMessages })
    }

    req.session.user = {
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role
    };

    res.redirect("/books")
  } catch (error) {
    console.log("Login error:", error.message, error.stack)
    res.render("auth/login.ejs", {
      errorMessages: { general: "Something went wrong. Please try again." },
    })
  }
});

router.get("/logout", (req, res) => {
    req.session.destroy()
    res.redirect("/auth/login")
})

module.exports = router