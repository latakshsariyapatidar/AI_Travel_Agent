import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
    {
        conversationId: {
            type: String,
            required: true,
            unique: true,
        },
        history: [
            {
                role: { type: String, required: true },
                content: { type: String, required: true },
                _id: false,
            },
        ],
        summary: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export const Conversation = mongoose.model("Conversation", conversationSchema);