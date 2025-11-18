import { HttpError } from './interface/HttpError';

export class ConflictError extends HttpError {
  constructor(message: string) {
    super(message, 409);
  }
}
