import mongoose from 'mongoose';

const exerciseSchema = {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: false,
        default: Date.now,
    },
};

export default exerciseSchema;
