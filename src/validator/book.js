const Joi = require('joi');

const validate = require('../utils/validate');

const validateFilterQueryGetBooks = (data)=>{
    const schema = Joi.object({
        title : Joi.string().allow(''),
        author : Joi.string().allow(''),
        page : Joi.number().integer().min(1).required(),
        limit : Joi.number().integer().min(1).required(),
    });

    return validate(schema, data);
}

module.exports = {
    validateFilterQueryGetBooks
}
