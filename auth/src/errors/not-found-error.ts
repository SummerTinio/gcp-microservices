import CustomError from 'errors/custom-error';

class NotFoundError extends CustomError {
  constructor() {
    super('Route not found');
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  statusCode = 404;

  reason = 'Not found';

  serializeErrors() {
    return [
      {
        message: this.reason,
      },
    ];
  }
}

export default NotFoundError;
