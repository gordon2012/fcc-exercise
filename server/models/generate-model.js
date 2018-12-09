import mongoose from 'mongoose';

const generateModel = (name, schema) => {
  delete mongoose.connection.models[name];
  return mongoose.model(name, schema);
};

// const userSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//     unique: true
//   }
// });

// delete mongoose.connection.models['user'];
// const User = mongoose.model('user', userSchema);

// export default User;
export default generateModel;
