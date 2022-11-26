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

class PreConditionFailedError extends HttpError {
    constructor(message) {
        super(message, 412)
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
    PreConditionFailedError,
    ConflictError,
}