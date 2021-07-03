class DatabaseConnectionError extends Error {
  reason = 'Error connecting to database';

  constructor() {
    super();

    // this is the TS way for this.prop = prop in a subclass
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
}

// import this into Request Route Handler -- i.e. files inside routes dir
export default DatabaseConnectionError;
