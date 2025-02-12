const ValidationException = require('../exceptions/ValidationException');

function validate(schema, data) {
    const {error, value} = schema.validate(data);

    if (error) {
        throw new ValidationException(error.message);
    }

    return value;
}

module.exports = validate;
