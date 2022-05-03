import express, { json } from 'express'
import Participants from './Routes/participants.js'
import Messages from './Routes/messages.js'
import Status from './Routes/status.js'
import CheckServer from './Helpers/checkServer.js'
import dotenv from 'dotenv'
import cors from 'cors'
import chalk from 'chalk'
dotenv.config()

const port = process.env.PORT
const app = express()
app.use(json())
app.use(cors())

app.listen(port, () => {
  console.log(chalk.bold.green(`Server is running on port/${port}`))
})

CheckServer()

app.post('/participants', Participants.post)

app.get('/participants', Participants.get)

app.post('/messages', Messages.post)

app.get('/messages', Messages.get)

app.delete('/messages/:idMessage', Messages.delete)

app.put('/messages/:idMessage', Messages.update)

app.post('/status', Status.post)
