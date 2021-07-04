import mongoose from 'mongoose';

// userAttrs === User attributes interface ***to ensure TS complains***
// if you request mongodb to create a new user with the wrong options
interface UserAttrs {
  email: string;
  password: string;
}

// interface to tell TS properties/methods expected on a User mongoose.Document
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  // if we need extra properties on a document, add them here.
}

// interface to tell TS properties/methods expected on a User mongoose.Model
interface UserModel extends mongoose.Model<UserDoc> {
  build(userAttributes: UserAttrs): UserDoc;
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

// create a static method on the user Schema itself
// so you can use it as an instance method on the User model

// call User.build() instead of new User({ //attributes })
// so that TS complains if you pass wrong/incomplete attributes
userSchema.statics.build = (userAttributes: UserAttrs) => new User(userAttributes);

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

// to create a new User document, call User.build() -- static method on userSchema
// with built-in TS error checks
export default User;
