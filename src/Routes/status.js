import { MongoClient } from 'mongodb'

const Status = {
  post: async (req, res) => {
    const mongoClient = new MongoClient(process.env.MONGO_URI)
    await mongoClient.connect()
    const db = mongoClient.db(process.env.MONGO_DB)

    const user = req.header('User')

    try {
      if (!(await db.collection('users').findOne({ name: user }))) {
        res.sendStatus(404)
        return
      }
      await db
        .collection('users')
        .updateOne({ name: user }, { $set: { lastStatus: Date.now() } })
      res.sendStatus(201)
      mongoClient.close()
    } catch (e) {
      res.status(400).send(e)
      mongoClient.close()
    }
  },
}

export default Status
