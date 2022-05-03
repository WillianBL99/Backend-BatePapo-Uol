/* eslint "comma-dangle": ["error", "never"] */

import { ObjectId } from 'mongodb'
import messageSchema from '../Helpers/messageSchema.js'
import isUserOnline from '../Helpers/isUserOnline.js'
import filterMessages from '../Helpers/filterMessages.js'
import ConnectDB from '../Models/connect_db.js'
import Dayjs from 'dayjs'
import messageExists from '../Helpers/messageExists.js'

const getMessage = async (req, res) => {
  const { limit } = req.query
  const user = req.header('User')
  const { db, connection } = await ConnectDB()

  try {
    const messages = db.collection('messages')

    if (limit) {
      const rangeMessages = await messages
        .find(filterMessages(user))
        .sort({ _id: -1 })
        .limit(parseInt(limit))
        .toArray()

      res.send(rangeMessages.reverse())
    } else {
      res.send(await messages.find(filterMessages(user)).toArray())
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
    const validate = messageSchema.validate(message, { abortEarly: false })

    if (validate.error) {
      res.status(422).send(validate.error)
    } else if (!(await isUserOnline(db, from))) {
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

const deleteMessage = async (req, res) => {
  const user = req.header('User')
  const { idMessage } = req.params
  const { db, connection } = await ConnectDB()

  try {
    const messages = db.collection('messages')
    const message = await messageExists(messages, idMessage)

    if (!message) {
      res.sendStatus(404)
      return
    } else if (message.from !== user) {
      res.sendStatus(401)
      return
    }

    await messages.deleteOne({ _id: new ObjectId(idMessage) })
    res.sendStatus(200)
    connection.close()
  } catch (e) {
    res.status(500).send(e)
    connection.close()
  }
}

const updateMessage = async (req, res) => {
  const from = req.header('User')
  const updatedMessage = req.body
  const { idMessage } = req.params
  const { db, connection } = await ConnectDB()

  try {
    const validate = messageSchema.validate(updatedMessage)
    const messages = db.collection('messages')
    const message = await messageExists(messages, idMessage)

    if (validate.error) {
      res.status(422).send(validate.error)
      return
    }

    if (!(await isUserOnline(db, from))) {
      res.status(422).send('User is offline')
      connection.close()
      return
    }

    if (!message) {
      res.sendStatus(404)
    }

    if (message.from !== from) {
      res.sendStatus(401)
      return
    }

    await messages.updateOne(
      { _id: ObjectId(idMessage) },
      { $set: updatedMessage }
    )

    res.sendStatus(200)
    connection.close()
  } catch (e) {
    res.status(500).send(e)
    connection.close()
  }
}

const Messages = {
  get: getMessage,
  post: postMessage,
  delete: deleteMessage,
  update: updateMessage,
}

export default Messages
