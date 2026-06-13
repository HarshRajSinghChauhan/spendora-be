export const createCategorySchema = Joi.object({
    name: Joi.string()
        .trim()
        .lowercase()
        .min(3)
        .max(100)
        .required(),

    type: Joi.string()
        .uppercase()
        .valid("INCOME", "EXPENSE")
        .required()
});