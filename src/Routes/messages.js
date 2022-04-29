import { MongoClient } from 'mongodb'
import Dayjs from 'dayjs'

const getMessage = async (req, res) => {}

const postMessage = async (req, res, db) => {
  const mongoClient = new MongoClient(process.env.MONGO_URI)
  const from = req.header('User')
  const { to, text, type } = req.body
  const time = Dayjs().format('HH:mm:ss')

  try {
    await mongoClient.connect()
    const db = mongoClient.db(process.env.MONGO_DB)
    const isUserConnected = await db.collection('users').findOne({ name: from })
    console.log(to, text, type, isUserConnected)
    if (
      !to ||
      !text ||
      (type !== 'message' && type !== 'private_message') ||
      !isUserConnected
    ) {
      res.sendStatus(422)
      return
    } else {
      await db.collection('messages').insertOne({
        from,
        to,
        text,
        type,
        time,
      })
      res.sendStatus(201)
    }
  } catch (e) {
    res.send('deu ruim')
  }
}

const Messages = {
  get: getMessage,
  post: postMessage,
}

export default Messages
