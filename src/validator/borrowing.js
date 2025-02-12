const Joi = require('joi');

const validate = require('../utils/validate');

const validateAddBorrowing = (data)=>{
    const schema = Joi.object({
        book_id: Joi.string().uuid().required(),
        member_id: Joi.string().uuid().required(),
    });
    return validate(schema, data);
}


const validateReturnBook = (data)=>{
    const schema = Joi.object({
        id: Joi.string().uuid().required(),
        member_id: Joi.string().uuid().required(),
    });

    return validate(schema, data);
}


module.exports = {
    validateAddBorrowing, validateReturnBook
}
