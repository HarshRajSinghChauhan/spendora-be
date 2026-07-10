import Joi from "joi";

export const createTransactionSchema = Joi.object({
    categoryId: Joi.string()
        .uuid()
        .required(),

    amount: Joi.number()
        .positive()
        .precision(2)
        .required(),

    type: Joi.string()
        .uppercase()
        .valid("INCOME", "EXPENSE")
        .required(),

    title: Joi.string()
        .trim()
        .max(100)
        .optional(),

    notes: Joi.string()
        .trim()
        .max(255)
        .allow("")
        .optional(),

    transactionDate: Joi.date()
        .optional()
});


export const updateTransactionSchema = Joi.object({
    categoryId: Joi.string().uuid(),

    amount: Joi.number()
        .positive()
        .precision(2),

    type: Joi.string()
        .uppercase()
        .valid("INCOME", "EXPENSE"),

    title: Joi.string()
        .trim()
        .max(100),

    notes: Joi.string()
        .trim()
        .max(255)
        .allow(""),

    transactionDate: Joi.date()
}).min(1);