import mongoose from 'mongoose';

// userAttrs === User attributes interface ***to ensure TS complains***
// if you request mongodb to create a new user with the wrong options
interface UserAttrs {
  email: string;
  password: string;
}

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

// call this method instead of new User({ //attributes })
// so that TS complains if you pass wrong/incomplete attributes
const newUser = function createNewUserDocument(userAttributes: UserAttrs) {
  return new User(userAttributes);
};

// QT: do we really need to export User out as well?
// -- yes, and you'd need to import both as well. Unless..
export { User, newUser };
