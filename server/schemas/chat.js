const NewChatSchema = {
    _id: { type: String, required: true },
    name: { type: String, required: false },
    members: { type: Array, required: true },
    avatar: { type: String, required: false },
    fromJobListing: { type: Boolean, required: true },
    created_by: { type: String, required: true },
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