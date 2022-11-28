class HttpError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}

class ValidationError extends HttpError {
    constructor(message) {
        super(message, 400)
    }
}

class UnprocessableEntity extends HttpError {
    constructor(message) {
        super(message, 422)
    }
}

class ConflictError extends HttpError {
    constructor(message) {
        super(message, 409)
    }
}

module.exports = {
    HttpError,
    ValidationError,
    UnprocessableEntity,
    ConflictError,
}