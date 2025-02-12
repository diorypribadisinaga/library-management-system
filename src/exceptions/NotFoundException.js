const ClientException = require('./ClientException');

class NotFoundException extends ClientException{
    constructor(message) {
        super(message, 404);
        this.name = 'NotFoundException';
    }
}

module.exports = NotFoundException;
