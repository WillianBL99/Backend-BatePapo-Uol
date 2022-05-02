import Dayjs from 'dayjs'
import isUserOnline from '../Helpers/isUserOnline.js'
import ConnectDB from '../Models/connect_db.js'

const postParticipants = async (req, res) => {
  const { db, connection } = await ConnectDB()
  const { name } = req.body

  if (!name || typeof name !== 'string') {
    res.sendStatus(422)
  } else {
    try {
      if (await isUserOnline(db, name)) {
        res.sendStatus(409)
        return
      }

      await db.collection('users').insertOne({
        name,
        lastStatus: Date.now(),
      })

      await db.collection('messages').insertOne({
        from: name,
        to: 'Todos',
        text: 'entra na sala...',
        type: 'status',
        time: Dayjs().format('HH:mm:ss'),
      })

      res.sendStatus(201)
      connection.close()
    } catch (e) {
      res.status(500).send(e)
      connection.close()
    }
  }
}

const getParticipants = async (req, res) => {
  const { db, connection } = await ConnectDB()
  try {
    const users = await db.collection('users').find().toArray()
    res.send(users)
    connection.close()
  } catch (e) {
    res.status(500).send(e)
    connection.close()
  }
}

const Participants = {
  post: postParticipants,
  get: getParticipants,
}

export default Participants
