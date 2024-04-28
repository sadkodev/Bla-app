import express from 'express'
// import { handler as ssrHandler } from '../dist/server/entry.mjs'

const app = express()
const PORT = 4000 || process.env.PORT

app.use('/', (req, res) => {
  res.send('Hello World')
})

app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`)
})
