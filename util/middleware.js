const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  // A simple catch-all for now as per the exercise instructions
  return response.status(400).json({ error: error.message })
}

module.exports = {
  errorHandler
}