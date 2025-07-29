const express = require("express")
const app = express()
const dotenv = require("dotenv").config()
const morgan = require("morgan")
const methodOverride = require("method-override")
const connectToDB = require("./config/db")
const cloudinary = require("./config/cloudinary")

console.log("Cloudinary ready:", cloudinary.config().cloud_name);

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"))



connectToDB()


// Routes



const port = process.env.PORT || 3000


app.listen(port,()=>{
    console.log("Listening on port " + port)
})