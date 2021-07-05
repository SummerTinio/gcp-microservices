import CustomError from "./custom-error";

class BadRequestError extends CustomError {
  constructor(errorString: string) {
    super(errorString);

    // no need for this.errorString = errorString;
    Object.setPrototypeOf(this, BadRequestError.prototype); // this is what enforces abstract props/methods
  }
  
  statusCode = 400;

  reason = 'Bad request';

  serializeErrors() {
    return [
      {
        message: this.reason,
      },
    ];
  }
}

export default BadRequestError;