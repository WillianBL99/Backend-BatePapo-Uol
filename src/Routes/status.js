import { MongoClient } from 'mongodb'
import ConnectDB from '../Models/connect_db.js'

const Status = {
  post: async (req, res) => {
    const { db, mongoClient } = await ConnectDB()
    const user = req.header('User')

    try {
      if (!(await db.collection('users').findOne({ name: user }))) {
        res.sendStatus(404)
        return
      }
      await db
        .collection('users')
        .updateOne({ name: user }, { $set: { lastStatus: Date.now() } })
      res.sendStatus(200)
      mongoClient.close()
    } catch (e) {
      res.status(400).send(e)
      mongoClient.close()
    }
  },
}

export default Status
