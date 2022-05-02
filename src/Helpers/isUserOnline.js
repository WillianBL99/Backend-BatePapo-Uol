const isUserOnline = async (db, name) => {
  const users = db.collection('users')
  const user = await users.findOne({ name })
  if (user) return true
  return false
}

export default isUserOnline
