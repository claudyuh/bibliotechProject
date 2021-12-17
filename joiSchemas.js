const Joi = require('joi')


exports.bookJoiSchema = Joi.object({
        title: Joi.string(),
        author: Joi.string().min(3).max(35),
        pages: Joi.number().integer().min(1).max(9999),
        description: Joi.string().min(10).max(2000),
        edition: Joi.number().min(0).max(9999),
        year: Joi.number().max(2021),
        category: Joi.string(),
        price: Joi.number().min(0).max(9999),
        rent: Joi.string(),
}).required();


exports.reviewJoiSchema = Joi.object({
        body: Joi.string().max(1000).allow(""),
        rating: Joi.number().integer().min(1).max(5).required()
});


exports.userJoiSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    username: Joi.string().alphanum().min(2).max(30),
    firstname: Joi.string().min(1).max(20),
    lastname: Joi.string().min(1).max(20),
    password: Joi.string().min(4).required(),
    confirmPassword: Joi.allow()
});







