import Dayjs from 'dayjs'
import { MongoClient } from 'mongodb'
const SECOND = 1000
const INTERVAL = 15

const dropUser = async (db, name) => {
  const time = Dayjs().format('HH:mm:ss')
  await db.collection('users').deleteOne({ name })
  await db.collection('messages').insertOne({
    from: name,
    to: 'Todos',
    text: 'sai da sala...',
    type: 'status',
    time,
  })
}

const CheckServer = () => {
  setInterval(async () => {
    const mongoClient = new MongoClient(process.env.MONGO_URI)
    await mongoClient.connect()
    const db = mongoClient.db(process.env.MONGO_DB)

    try {
      const users = await db.collection('users').find({}).toArray()
      const date = Date.now()

      if (users.length) {
        for (let user of users) {
          if (date - user.lastStatus >= 10 * SECOND) {
            await dropUser(db, user.name)
          }
        }
      }

      mongoClient.close()
    } catch (e) {
      console.log('não vai analizar mais')
      mongoClient.close()
    }
  }, INTERVAL * SECOND)
}

export default CheckServer
