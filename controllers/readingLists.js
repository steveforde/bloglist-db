const router = require('express').Router()
const { ReadingList, Blog, User } = require('../models')
const { tokenExtractor } = require('../util/middleware')

const formatEntry = (entry) => ({
  id: entry.id,
  read: entry.read,
  user_id: entry.userId,
  blog_id: entry.blogId,
})

router.post('/', async (req, res) => {
  const { blogId, userId } = req.body

  if (!blogId) {
    return res.status(400).json({ error: 'blogId is required' })
  }
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' })
  }

  const blog = await Blog.findByPk(blogId)
  if (!blog) {
    return res.status(404).json({ error: 'blog not found' })
  }

  const user = await User.findByPk(userId)
  if (!user) {
    return res.status(404).json({ error: 'user not found' })
  }

  const existing = await ReadingList.findOne({ where: { blogId, userId } })
  if (existing) {
    return res.status(400).json({ error: 'blog already in reading list' })
  }

  const readingList = await ReadingList.create({ blogId, userId })
  res.status(201).json(formatEntry(readingList))
})

router.put('/:id', tokenExtractor, async (req, res) => {
  const readingListItem = await ReadingList.findByPk(req.params.id)

  if (!readingListItem) {
    return res.status(404).json({ error: 'reading list item not found' })
  }

  if (readingListItem.userId !== req.decodedToken.id) {
    return res.status(401).json({ error: 'operation not allowed' })
  }

  readingListItem.read = req.body.read
  await readingListItem.save()

  res.json(formatEntry(readingListItem))
})

module.exports = router