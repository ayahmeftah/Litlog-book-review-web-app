const express = require("express")
const app = express()
const dotenv = require("dotenv").config()
const morgan = require("morgan")
const methodOverride = require("method-override")
const connectToDB = require("./config/db")
const connectToCloudinary = require("./config/cloudinary")
const mutler = require("multer")



// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"))



connectToDB()
// connectToCloudinary()


// Routes



const port = process.env.PORT || 3000


app.listen(port,()=>{
    console.log("Listening on port " + port)
})