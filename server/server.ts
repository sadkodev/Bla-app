import cors from 'cors'
import express from 'express'
import socket from './socket'

const app = express()

const configCors = {
  origin: '*',
}

app.use(cors())

const PORT = process.env.PORT && 5000

const server = app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`)
})

socket(server)
