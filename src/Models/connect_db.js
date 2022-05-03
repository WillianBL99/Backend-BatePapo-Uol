import { MongoClient } from 'mongodb'
import chalk from 'chalk'

const ConnectDB = async () => {
  let db = null
  let mongoClient = null

  try {
    mongoClient = new MongoClient(process.env.MONGO_URI)
    await mongoClient.connect()
    db = mongoClient.db(process.env.MONGO_DB)
    //console.log(chalk.blue.bold('Successful connection!'))
  } catch (e) {
    console.log(chalk.red.bold('Unsuccessful connection!'))
  }

  const connection = {
    close: () => {
      mongoClient.close()
      //console.log(chalk.yellow.bold('Connection closed!'))
    },
  }

  return { db, connection }
}

export default ConnectDB
