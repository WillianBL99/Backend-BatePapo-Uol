import { MongoClient } from 'mongodb'

const conectDB = async () => {
  const mongoClient = new MongoClient(process.env.MONGO_URI)
  let db
  try {
    await mongoClient.connect()
    db = mongoClient.db('bate_papo_uol')
  } catch (e) {
    console.log('Conecção com o banco falhou')
  }

  return db
}

export default conectDB
