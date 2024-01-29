const router = require("express").Router();
const User = require("../models/User")
const Post = require("../models/Post")
const bcrypt = require("bcrypt")


router.put("/:id", async (req, res) => {
  if(req.body.userId === req.params.id){
    if(req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt)
    }
    try{
      const updatedUser = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body
      })
      const {password, ...others} = updatedUser._doc;
      return res.status(200).json(others)
    } catch(err){
      return res.status(500).json({message: "Error trying to update user", error: err})
    } 
  }else{
    return res.status(401).json({message: "You can't update other's account"})
  }
})


//DELETE
router.delete("/:id", async (req, res) => {
  if(req.body.userId === req.params.id){
   try{
    const user = await User.findById(req.params.id)
    try{
      await Post.deleteMany({username: user.username})
      await User.findByIdAndDelete(req.params.id)
      return res.status(200).json({message: "User has been deleted"})
    } catch(err){
      return res.status(500).json({message: "Error trying to update user", error: err})
    } 
   } catch (err){
    res.status(404).json({message: "User not found"})
   }
  }else{
    return res.status(401).json({message: "You can't delete other's account"})
  }
})
//GET 

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const {password, ...others} = user._doc;
    return res.status(200).json(others)
  } catch (err) {
    return res.status(500).json(err)
  }
})
module.exports = router

