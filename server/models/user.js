import mongoose from 'mongoose';
import generateModel from './generate-model';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  }
});

const User = generateModel('user', userSchema);

export default User;
