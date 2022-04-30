import ConnectDB from '../Models/connect_db.js'
import messageSchema from '../Helpers/messageSchema.js'
import isOnline from '../Helpers/isOline.js'
import Dayjs from 'dayjs'

const getMessage = async (req, res) => {
  const { limit } = req.query
  const { db, connection } = await ConnectDB()

  try {
    const messages = db.collection('messages')
    if (limit) {
      console.log('tempage', limit)
      const rangeMessages = await messages
        .find()
        .sort({ _id: -1 })
        .limit(parseInt(limit))
        .toArray()
      res.send(rangeMessages)
    } else {
      const allMessages = await messages.find().toArray()
      res.send(allMessages)
    }

    connection.close()
  } catch (e) {
    res.status(500).send(e)
    connection.close()
  }
}

const postMessage = async (req, res) => {
  const { db, connection } = await ConnectDB()

  const message = req.body
  const from = req.header('User')
  const time = Dayjs().format('HH:mm:ss')

  try {
    const validate = messageSchema.validate(message)

    if (validate.error) {
      res.status(422).send(validate.error)
    } else if (!(await isOnline(db, from))) {
      res.status(422).send('User is offline')
      connection.close()
      return
    }

    await db.collection('messages').insertOne({
      from,
      ...message,
      time,
    })
    res.sendStatus(201)
    connection.close()
  } catch (e) {
    res.status(500).send(e)
    connection.close()
  }
}

const Messages = {
  get: getMessage,
  post: postMessage,
}

export default Messages
