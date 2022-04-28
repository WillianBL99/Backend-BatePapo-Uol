const getMessage = async (req, res) => {}

const postMessage = async (req, res, db) => {
  const sender = userreq.header('User')
  const { to, text, type } = req.body
  const date = Date()

  if (
    !to ||
    !text ||
    (type !== 'message' && type !== 'private_message')
    // FIXME verificar se o participante está online
  ) {
    res.sendStatus(422)
  } else {
    res.sendStatus(201)
  }
}

const Messages = {
  get: getMessage,
  post: postMessage,
}
