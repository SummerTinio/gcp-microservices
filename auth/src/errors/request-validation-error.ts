// to use this, throw new RequestValidationError(error) from inside endpoint callback

// ValidationError === TS type describing requirements we need
import { ValidationError } from 'express-validator';

class RequestValidationError extends Error {
  // private === private fields class syntax.
  // way of declaring a class field to be
  // unavailable outside the containing class,
  // including to subclasses
  // same as saying: this.errors = errors
  // and: errors: ValidationError[]
  constructor(public errors: ValidationError[]) {
    super();
    // this.errors = errors; // gives
    // setting subclass prototype explicitly in constructor
    // since we're extending a built-in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
}

// import this into Request Route Handler -- i.e. files inside routes dir
export default RequestValidationError;
