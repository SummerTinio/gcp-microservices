import CustomError from 'errors/custom-error';

class NotAuthorizedError extends CustomError {
  constructor(errorString?: string) {
    super(errorString || 'Not authorized');
    Object.setPrototypeOf(this, NotAuthorizedError);
  }

  statusCode = 401;

  serializeErrors() {
    return [
      {
        message: 'Not authorized',
      },
    ]
  }
}

export default NotAuthorizedError;