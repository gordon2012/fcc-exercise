import generateModel from './generate-model';

const userSchema = {
  username: {
    type: String,
    required: true,
    unique: true
  }
};

const User = generateModel('user', userSchema);

export default User;
