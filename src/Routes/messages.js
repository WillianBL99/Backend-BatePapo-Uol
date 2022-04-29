import { MongoClient } from 'mongodb'
import Dayjs from 'dayjs'

const getMessage = async (req, res) => {
  const mongoClient = new MongoClient(process.env.MONGO_URI)
  try {
    await mongoClient.connect()
    const db = mongoClient.db(process.env.MONGO_DB)
    const messages = await db.collection('messages').find({}).toArray()
    mongoClient.close
    res.send(messages)
  } catch (e) {
    mongoClient.close()
    res.send('Não conseguiu enviar as messagens')
  }
}

const postMessage = async (req, res, db) => {
  const mongoClient = new MongoClient(process.env.MONGO_URI)
  const from = req.header('User')
  const { to, text, type } = req.body
  const time = Dayjs().format('HH:mm:ss')

  try {
    await mongoClient.connect()
    const db = mongoClient.db(process.env.MONGO_DB)
    const isUserConnected = await db.collection('users').findOne({ name: from })
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
      mongoClient.close()
      res.sendStatus(201)
    }
  } catch (e) {
    mongoClient.close()
    res.send('deu ruim')
  }
}

const Messages = {
  get: getMessage,
  post: postMessage,
}

export default Messages
