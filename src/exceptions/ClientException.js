class ClientException extends Error{
    constructor(message, code = 400) {
        super(message);
        this.name = 'ClientException';
        this.code = code;
    }
}

module.exports = ClientException;
