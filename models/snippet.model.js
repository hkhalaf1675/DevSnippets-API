const { Schema, default: mongoose } = require("mongoose");

const snippetSchema = new Schema({
    title: { type: String, required: true },
    language: { type: String, required: true },
    code: { type: String, required: true },
    description: { type: String, required: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Users', required: true }
}, { timestamps: true });

snippetSchema.index({language: 1});

module.exports = mongoose.model('Snippets', snippetSchema);