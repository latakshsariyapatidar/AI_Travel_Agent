import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
    {
        conversationId: {
            type: String,
            required: true,
            unique: true,
        },
        customer: {
            name: { type: String, default: null },
            phone: { type: String, default: null },
            email: { type: String, default: null },
        },
        travel: {
            destination: { type: String, default: null },

            travelDate: { type: String, default: null },
            travellers: { type: Number, default: null },
            budget: { type: String, default: null },
            duration: { type: String, default: null },
            tripType: { type: String, default: null },
            specialRequirements: { type: String, default: null },
        },
        qualification: {
            leadScore: { type: Number, min: 0, max: 100, default: null },
            confidence: { 
                type: String, 
                enum: ["Low", "Medium", "High", null], 
                default: null 
            },
            reason: { type: String, default: null },
            summary: { type: String, default: null },
        },
    },
    {
        timestamps: true, // Automatically manages createdAt and updatedAt
    }
);

export const Lead = mongoose.model("Lead", leadSchema);
