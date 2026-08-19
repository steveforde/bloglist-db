const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const Session = require('../models/session')
const ReadingList = require('../models/reading_list')

router.post('/', async (req, res) => {
  await Session.destroy({ truncate: { cascade: true } })
  await ReadingList.destroy({ truncate: { cascade: true } })
  await Blog.destroy({ truncate: { cascade: true } })
  await User.destroy({ truncate: { cascade: true } })
  res.status(204).end()
})

module.exports = router