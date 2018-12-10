import mongoose from 'mongoose';

const generateModel = (name, schema) => {
  delete mongoose.connection.models[name];
  return mongoose.model(
    name,
    new mongoose.Schema(schema, { versionKey: false })
  );
};

export default generateModel;
