const Joi = require('joi');

const validate = require('../utils/validate');

const validateAddMember = (data)=>{
    const schema = Joi.object({
        name : Joi.string().required(),
        email : Joi.string().email().required(),
        phone : Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
        address : Joi.string().required(),
    });

    return validate(schema, data);
}

const validateFilterQueryGetMemberBorrowingsHistory = (data)=>{
    const schema = Joi.object({
        id: Joi.string().uuid().required(),
        status : Joi.string().valid('RETURNED','BORROWED').optional(),
        page : Joi.number().integer().min(1).required(),
        limit : Joi.number().integer().min(1).required(),
    });

    return validate(schema, data);
}


module.exports = {
    validateAddMember, validateFilterQueryGetMemberBorrowingsHistory
}
