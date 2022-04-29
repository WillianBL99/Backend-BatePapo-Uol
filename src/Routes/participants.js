import Dayjs from 'dayjs'
import { MongoClient } from 'mongodb'

const postParticipants = async (req, res) => {
  const { name } = req.body
  const mongoClient = new MongoClient(process.env.MONGO_URI)

  if (!name || typeof name !== 'string') {
    res.sendStatus(422)
  } else {
    try {
      await mongoClient.connect()
      const db = mongoClient.db(process.env.MONGO_DB)

      if (await db.collection('users').findOne({ name: name })) {
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

      mongoClient.close()
      res.sendStatus(201)
    } catch (e) {
      res.status(404).send(e)
      mongoClient.close()
    }
  }
}

const getParticipants = async (req, res) => {
  const mongoClient = new MongoClient(process.env.MONGO_URI)
  try {
    await mongoClient.connect()
    const db = mongoClient.db(process.env.MONGO_DB)
    const users = await db.collection('users').find({}).toArray()
    mongoClient.close()
    res.send(users)
  } catch (e) {
    mongoClient.close()
    res.send('erro na conxão')
  }
}

const Participants = {
  post: postParticipants,
  get: getParticipants,
}

export default Participants
