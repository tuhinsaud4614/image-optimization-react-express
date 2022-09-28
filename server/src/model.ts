export class HttpError extends Error {
  constructor(message: string, public code: number) {
    super(message);

    // this is for instanceof behave properly
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}
