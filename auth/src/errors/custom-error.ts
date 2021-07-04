abstract class CustomError extends Error {
  constructor(errorString: string) {
    super(errorString);

    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract statusCode: number;

  abstract serializeErrors(): {
    message: string,
    field?: string
  }[];
}

export default CustomError;
