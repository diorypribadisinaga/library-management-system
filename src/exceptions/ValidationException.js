const ClientException = require('./ClientException');

class ValidationException extends ClientException{
    constructor(message) {
        super(message);
        this.name = 'ValidationException';
    }
}

module.exports = ValidationException;
