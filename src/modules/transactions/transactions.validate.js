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
        .iso()
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

    transactionDate: Joi.date().iso()
}).min(1);

export const getTransactionsQuerySchema = Joi.object({
    type: Joi.string()
        .uppercase()
        .valid("INCOME", "EXPENSE")
        .optional(),

    from: Joi.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .message('"from" must be a valid date in YYYY-MM-DD format')
        .optional(),

    to: Joi.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .message('"to" must be a valid date in YYYY-MM-DD format')
        .optional(),

    page: Joi.number()
        .integer()
        .min(1)
        .default(1),

    limit: Joi.number()
        .integer()
        .min(1)
        .default(10)
});