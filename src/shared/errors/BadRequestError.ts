import { HttpError } from "./interface/HttpError";

export class BadRequestError extends HttpError {
    constructor(message: string) {
        super(message, 400);
    }
}