import express, { json } from 'express'
import Participants from './Routes/participants.js'
import Messages from './Routes/messages.js'
import Status from './Routes/status.js'
import CheckServer from './Helpers/checkServer.js'
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()

const app = express()
app.use(json())
app.use(cors())

app.listen(process.env.PORT, () => {
  console.log('runing')
})

CheckServer()

app.post('/participants', Participants.post)

app.get('/participants', Participants.get)

app.post('/messages', Messages.post)

app.get('/messages', Messages.get)

app.delete('/messages/:idMessage', Messages.delete)

app.post('/status', Status.post)
