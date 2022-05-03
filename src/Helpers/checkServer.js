import chalk from 'chalk'
import Dayjs from 'dayjs'
import ConnectDB from '../Models/connect_db.js'
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
    const { db, connection } = await ConnectDB()

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

      connection.close()
    } catch (e) {
      console.log(chalk.bold.red('Error in checkServer'), e)
      connection.close()
    }
  }, INTERVAL * SECOND)
}

export default CheckServer
