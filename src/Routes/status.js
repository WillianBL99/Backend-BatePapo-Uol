import ConnectDB from '../Models/connect_db.js'

const Status = {
  post: async (req, res) => {
    const { db, connection } = await ConnectDB()
    const user = req.header('User')

    try {
      const users = db.collection('users')
      if (!(await users.findOne({ name: user }))) {
        res.sendStatus(404)
        connection.close()
        return
      }
      await users.updateOne(
        { name: user },
        { $set: { lastStatus: Date.now() } }
      )
      res.sendStatus(200)
      connection.close()
    } catch (e) {
      res.status(400).send(e)
      connection.close()
    }
  },
}

export default Status
