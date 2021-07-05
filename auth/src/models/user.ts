import mongoose from 'mongoose';
import Password from 'services/password';
import { UserAttrs, UserDoc, UserModel } from 'models/interface-mongoose';

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
},
  { // mongoose-specific implementation of toJson() method override
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id; // deletes old _id
        delete ret.password;
        delete ret.__v; // deletes versionKey
      }
    }
  },
);

// Mongoose middleware to intercept a save attempt
// eslint-disable-next-line prefer-arrow-callback
userSchema.pre('save', async function (done) {
  // to prevent re-hashing. only hash if modified!
  if (this.isModified('password')) { // will return true if User.build() was finished already
    const documentPassword = this.get('password');
    const hashed = await Password.toHash(documentPassword);
    this.set('password', hashed);
  }
  done();
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
