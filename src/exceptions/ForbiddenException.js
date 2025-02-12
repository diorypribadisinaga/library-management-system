const ClientException = require('./ClientException');

class ForbiddenException extends ClientException{
    constructor(message) {
        super(message, 403);
        this.name = 'ForbiddenException';
    }
}

module.exports = ForbiddenException;
