const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')
const blogsRouter = require('./controllers/blogs')
const { errorHandler } = require('./util/middleware')

app.use(express.json())

app.use('/api/blogs', blogsRouter)

app.use(errorHandler) // ADD THIS: Must be loaded after the routes

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()