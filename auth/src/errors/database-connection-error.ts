import CustomError from 'errors/custom-error';

class DatabaseConnectionError extends CustomError {
  constructor() {
    super('Error connecting to database');
    // this is the TS way for this.prop = prop in a subclass
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  statusCode = 503; // Service Unavailable

  reason = 'Error connecting to database';

  serializeErrors() {
    return [
      {
        message: this.reason,
      },
    ];
  }
}
// import this into Request Route Handler -- i.e. files inside routes dir
export default DatabaseConnectionError;
