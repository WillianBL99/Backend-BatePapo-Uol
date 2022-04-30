import joi from 'joi'

const messageSchema = joi.object({
  to: joi.string().required(),
  text: joi.string(),
  type: joi.any().valid('message', 'private_message').required(),
})

export default messageSchema
