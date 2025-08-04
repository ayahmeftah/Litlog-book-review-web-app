const express = require("express")
const app = express()
const dotenv = require("dotenv").config()
const morgan = require("morgan")
const session = require("express-session");
const methodOverride = require("method-override")
const connectToDB = require("./config/db")

const authRoutes = require("./routes/authRoutes")
const booksRoutes = require("./routes/booksRoutes")
const userRoutes = require("./routes/userRoutes")

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});




connectToDB()

// Routes
app.use('/', (req,res)=>{
  res.redirect('/books/home')
})
app.use("/books", booksRoutes)
app.use("/users", userRoutes)
app.use("/auth", authRoutes)


const port = process.env.PORT || 3000


app.listen(port,()=>{
    console.log("Listening on port " + port)
})