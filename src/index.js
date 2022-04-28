import express, { json } from 'express'
//import clientDB from './Models/client.js'
import Participants from './Routes/participants.js'
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()

// let db
// clientDB.then((client) => {
//   db = client
// })

const app = express()
app.use(json())
app.use(cors())

app.listen(5000, () => {
  console.log('runing')
})

app.post('/participants', Participants.post)

app.get('/participants', Participants.get)

app.post('/messages', (req, res) => {
  // FIXME
  res.send('messages')
})

app.get('/messages', (req, res) => {
  // FIXME
  res.send('messages')
})

app.post('/status', (req, res) => {
  // FIXME
  res.send('status')
})
