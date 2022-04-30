import ConnectDB from '../Models/connect_db.js'
import messageSchema from '../Helpers/messageSchema.js'
import Dayjs from 'dayjs'

const isOnline = async (db, name) => {
  const users = db.collection('users')
  const user = await users.findOne({ name })
  if (user) return true
  return false
}

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

  const message = req.body
  const from = req.header('User')
  const time = Dayjs().format('HH:mm:ss')

  try {
    const validate = messageSchema.validate(message)

    if (validate.error) {
      res.status(422).send(validate.error)
    } else if (!(await isOnline(db, message.from))) {
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
