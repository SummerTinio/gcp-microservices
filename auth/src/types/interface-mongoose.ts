import mongoose from 'mongoose';

// userAttrs === User attributes interface ***to ensure TS complains***
// if you request mongodb to create a new user with the wrong options
export interface UserAttrs {
  email: string;
  password: string;
}

// interface to tell TS properties/methods expected on a User mongoose.Document
export interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  // if we need extra properties on a document, add them here.
}

// interface to tell TS properties/methods expected on a User mongoose.Model
export interface UserModel extends mongoose.Model<UserDoc> {
  build(userAttributes: UserAttrs): UserDoc;
}