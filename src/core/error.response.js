const myLogger = require('../loggers/mylogger.log')

const StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404
}
const ReasonStatusCode = {
    FORBIDDEN: 'Bad request error',
    CONFLICT: 'Conflict error ',
    UNAUTHORIZED: 'Unauthorized',
    NOT_FOUND: 'NotFound Error'
}

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message)
        this.status = status

        //log the eror use winston
        myLogger.error(this.message, ['api/v1/login', 'vtv334', { error: 'bad requets error' }])
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFLICT, status = StatusCode.FORBIDDEN) {
        super(message, status)
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFLICT, status = StatusCode.FORBIDDEN) {
        super(message, status)
    }
}
class AuthFailureError extends ErrorResponse {
    constructor(message = ReasonStatusCode.UNAUTHORIZED, status = StatusCode.UNAUTHORIZED) {
        super(message, status)
    }
}
class NotFoundError extends ErrorResponse {
    constructor(message = ReasonStatusCode.NOT_FOUND, status = StatusCode.NOT_FOUND) {
        super(message, status)
    }
}
class ForbiddenError extends ErrorResponse {
    constructor(message = ReasonStatusCode.FORBIDDEN, status = StatusCode.FORBIDDEN) {
        super(message, status)
    }
}
module.exports = {
    ConflictRequestError,
    BadRequestError,
    AuthFailureError,
    NotFoundError,
    ForbiddenError
}