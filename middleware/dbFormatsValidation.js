const Joi = require('joi'); 
const ExpressError = require('../utils/ExpressError')
const { bookJoiSchema, reviewJoiSchema, userJoiSchema } = require('../joiSchemas')

exports.bookValidation =  (req, res, next) => { 
    const { error } = bookJoiSchema.validate(req.body); 
    if(error){
        const msg =  error.details.map(el => el.message).join(',');
        return next(new ExpressError(msg, 400));
    } else { 
        next();
    } 
} 


exports.reviewValidation =  (req, res, next) => { 
    const { error } = reviewJoiSchema.validate(req.body); 
    if(error){
        const msg =  error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else { 
        next();
    } 
} 

exports.userValidation =  (req, res, next) => { 
    const { error } = userJoiSchema.validate(req.body); 
    if(error){
        const msg =  error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else { 
        next();
    } 
} 

