import { ObjectId } from 'mongodb'

const messageExists = async (collection, id) => {
  const [message] = await collection.find({ _id: new ObjectId(id) }).toArray()

  return message
}

export default messageExists
