const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'SequelizeValidationError') {
    const messages = error.errors.map(err => err.message)
    return response.status(400).json({ error: messages })
  }

  return response.status(400).json({ error: error.message })
}

module.exports = {
  errorHandler
}