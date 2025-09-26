import { HttpError } from "./interface/HttpError";

export class UnauthorizedError extends HttpError {
    constructor(message: string) {
        super(message, 401);
    }
}
