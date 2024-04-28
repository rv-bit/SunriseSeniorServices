const NewChatSchema = {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    members: { type: Array, required: true },
    created_at: { type: String, required: true }
}

const NewMessageSchema = {
    _id: { type: String, required: true },
    chat_id: { type: String, required: true },
    message: { type: String, required: true },
    sender_id: { type: String, required: true },
    created_at: { type: String, required: true }
}

module.exports = {
    NewChatSchema,
    NewMessageSchema
};