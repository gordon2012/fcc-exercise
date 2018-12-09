import mongoose from 'mongoose';

const foobarSchema = new mongoose.Schema({
  foo: String,
  bar: String
});

const Foobar = mongoose.model('foobar', foobarSchema);

export default Foobar;
