const NewJobListingSchema = {
    _id: { type: String },
    user_id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    additional_information: { type: String, default: '' },
    payment_type: { type: String, required: true },
    payment_amount: { type: Number, required: true },
    start_date: { type: String, required: true },
    days: { type: Array, required: true },
    hours: { type: Number, required: true },
    location: { type: String, required: true },
    posted_at: { type: String, required: true }
}

module.exports = {
    NewJobListingSchema
}