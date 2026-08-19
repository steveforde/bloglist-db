const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')
const Session = require('../models/session')

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    let token
    try {
      token = authorization.substring(7)
      req.token = token
      req.decodedToken = jwt.verify(token, SECRET || 'secret')
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }

    const session = await Session.findOne({ where: { token } })
    if (!session) {
      return res.status(401).json({ error: 'session expired, please log in again' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: error.errors.map(e => e.message) })
  }

  next(error)
}

module.exports = {
  tokenExtractor,
  errorHandler
}