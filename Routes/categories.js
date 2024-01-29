const router = require("express").Router();
const Category = require("../models/Category")

router.post("/", async (req, res) => {
  const newCategory = new Category(req.body)
  try {
    const savedCategory = await newCategory.save()
    return res.status(200).json(savedCategory)
  } catch (err) {
    return res.status(500).json(err)
  }
})


module.exports = router