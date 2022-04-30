import ConnectDB from '../Models/connect_db.js'
import Dayjs from 'dayjs'

const getMessage = async (req, res) => {
  const { db, connection } = await ConnectDB()
  try {
    const messages = await db.collection('messages').find({}).toArray()
    res.send(messages)
    connection.close()
  } catch (e) {
    res.status(500).send(e)
    connection.close()
  }
}

const postMessage = async (req, res) => {
  const { db, connection } = await ConnectDB()
  const from = req.header('User')
  const { to, text, type } = req.body
  const time = Dayjs().format('HH:mm:ss')

  try {
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
      res.sendStatus(201)
      connection.close()
    }
  } catch (e) {
    res.send('deu ruim')
    connection.close()
  }
}

const Messages = {
  get: getMessage,
  post: postMessage,
}

export default Messages
