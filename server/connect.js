import mongoose from 'mongoose';

const dbUrl =
    process.env.NODE_ENV !== 'production'
        ? 'mongodb://localhost:27017/fcc-exercise'
        : process.env.ATLAS_URI;

const connect = async (model, schema) => {
    const connection = await mongoose.createConnection(dbUrl, {
        useNewUrlParser: true,
        bufferCommands: false,
        bufferMaxEntries: 0,
    });

    return connection.model(model, schema);
};

export default connect;
