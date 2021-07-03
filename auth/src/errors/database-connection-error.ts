class DatabaseConnectionError extends Error {
  constructor() {
    super();

    // this is the TS way for this.prop = prop in a subclass
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  reason = 'Error connecting to database';
}

// import this into Request Route Handler -- i.e. files inside routes dir
export default DatabaseConnectionError;
