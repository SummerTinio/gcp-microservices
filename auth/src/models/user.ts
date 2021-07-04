import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { // for Mongoose validation, not TS-related.
    // String === reference to JS String constructor.
    type: String, // if TS interface, lowercase string
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('User', userSchema);

export default User;
