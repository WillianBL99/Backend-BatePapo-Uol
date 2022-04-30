const filterMessages = (user) => {
  return {
    $or: [
      {
        to: 'Todos',
      },
      {
        to: user,
      },
      {
        from: user,
      },
      {
        type: 'message',
      },
    ],
  }
}

export default filterMessages
