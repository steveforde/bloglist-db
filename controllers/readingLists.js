const router = require('express').Router()
const { ReadingList, User, Blog } = require('../models')

router.post('/', async (req, res, next) => {
  try {
    const { userId, blogId } = req.body

    const user = await User.findByPk(userId)
    const blog = await Blog.findByPk(blogId)

    if (!user || !blog) {
      return res.status(400).json({ error: 'Invalid userId or blogId' })
    }

    const readingList = await ReadingList.create({ userId, blogId })
    res.json(readingList)
  } catch (error) {
    next(error)
  }
})

module.exports = router