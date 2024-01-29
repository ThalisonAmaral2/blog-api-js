const express = require('express');
const app = express();
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const authRoute = require("./Routes/auth");
const usersRoute = require("./Routes/users")
const postsRoute = require("./Routes/posts")
const categoriesRoute = require("./Routes/categories")
const multer = require("multer")

dotenv.config();
app.use(express.json())
mongoose.connect(process.env.MONGO_URL)
.then(console.log("Connected to MongoDB"))
.catch((err) => console.log(err));

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images")
  }, 
  filename: (req, file, callback) => {
    callback(null, "file.jpg" /*req.body.name*/)
  }
})

const upload = multer({storage: storage})
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded")
})

app.use("/api/auth", authRoute)
app.use("/api/users", usersRoute)
app.use("/api/posts", postsRoute)
app.use("/api/categories", categoriesRoute)


app.listen("5000", () => {
  console.log("Server is running at 5000")
})