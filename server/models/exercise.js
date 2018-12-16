import mongoose from 'mongoose';
import generateModel from './generate-model';

const exerciseSchema = {
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: false,
    default: Date.now
  }
};

const Exercise = generateModel('exercise', exerciseSchema);

export default Exercise;
