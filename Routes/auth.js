const router = require("express").Router();
const User = require("../models/User")
const bcrypt = require('bcrypt');

//REGISTER
router.post("/register", async (req, res) => {
  try{
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt)
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    })

    const user = await newUser.save() //Method that comes from mongoose
    res.status(200).json({message: `${user.username} created successfully`, data: {user}})
  } catch(err){
    res.status(500).json({message: "Error trying to register user", error: err})
  } 
})

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(400).json("Wrong credentials!");
    }

    const validate = await bcrypt.compare(req.body.password, user.password);

    if (!validate) {
      return res.status(400).json("Wrong credentials!");
    }
    const {password, ...others} = user._doc;

    return res.status(200).json({ message: "Login successful", data: others });
  } catch (err) {
    return res.status(500).json({ message: "Error trying to login", error: err });
  }
});


module.exports = router