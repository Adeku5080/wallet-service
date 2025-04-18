export class CustomError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean; 

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
    this.isOperational = true;

    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}
