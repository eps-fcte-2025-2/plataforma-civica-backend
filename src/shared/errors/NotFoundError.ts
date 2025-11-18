import { HttpError } from './interface/HttpError';

export class NotFoundError extends HttpError {
  constructor(message: string) {
    super(message, 404);
  }
}
