const router = require('express').Router()
const { ReadingList } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.post('/', async (req, res) => {
  const readingList = await ReadingList.create(req.body)
  res.json(readingList)
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
  
  res.json(readingListItem)
})

module.exports = router