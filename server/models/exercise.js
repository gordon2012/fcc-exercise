import mongoose from 'mongoose';
import generateModel from './generate-model';

const exerciseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
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
    type: String,
    required: false
  }
});

const Exercise = generateModel('exercise', exerciseSchema);

export default Exercise;
