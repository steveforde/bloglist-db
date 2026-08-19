const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = require('express').Router()
const { SECRET } = require('../util/config')
const User = require('../models/user')
const Session = require('../models/session')
const { tokenExtractor } = require('../util/middleware')

router.post('/login', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({
    where: { username: username }
  })

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  if (user.disabled) {
    return response.status(401).json({
      error: 'account disabled, please contact admin'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)

  // Save active session to database
  await Session.create({
    userId: user.id,
    token: token
  })

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

// Logout route
router.delete('/logout', tokenExtractor, async (request, response) => {
  await Session.destroy({
    where: {
      userId: request.decodedToken.id,
      token: request.token
    }
  })
  response.status(204).end()
})

module.exports = router