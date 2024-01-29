const router = require("express").Router();
const User = require("../models/User")
const Post = require("../models/Post")

//CREATE
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    return res.status(200).json(savedPost)
  } catch (err) {
    return res.status(500).json(err)
  }
})

//UPDATE
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    try {
      if(post.username === req.body.username){
        try {
          const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
            $set: req.body
          })
          return res.status(200).json(updatedPost)
        } catch (err) {
         return res.status(500).json(err)
        }
      }else{
        return res.status(401).json("You can only update your post")
      }
    } catch (err) {
      
    }
  } catch (err) {
    return res.status(500).json(err)
  }
})




//DELETE
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    try {
      if(post.username === req.body.username){
        try {
          await post.deleteOne()
          return res.status(200).json("Post has been deleted")
        } catch (err) {
          console.error(err); 
         return res.status(500).json("Could not delete")
        }
      }else{
        return res.status(401).json("You can only delete your post")
      }
    } catch (err) {
      
    }
  } catch (err) {
    return res.status(500).json(err)
  }
})

//GET 
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    return res.status(200).json(post)
  } catch (err) {
    return res.status(500).json(err)
  }
})

//GET ALL
router.get("/", async (req, res) => {
  const username = req.query.user
  const category = req.query.category
  try {
    let posts;
    if(username){
      posts = await Post.find({username: username})
    } else if (category){
      posts = await Post.find({categories: {
        $in: [category]
      }})
    } else {
      posts = await Post.find();
    }
    return res.status(200).json(posts)
  } catch (err) {
    console.error(err)
    return res.status(500).json(err)
  }
})
module.exports = router

