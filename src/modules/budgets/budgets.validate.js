import Joi from "joi";

export const createBudgetSchema = Joi.object({
  categoryId: Joi.string()
    .uuid()
    .allow(null)
    .optional()
    .messages({
      "string.guid": '"categoryId" must be a valid UUID'
    }),

  limitAmount: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      "number.base": '"limitAmount" must be a number',
      "number.positive": '"limitAmount" must be greater than zero',
      "any.required": '"limitAmount" is required'
    }),

  budgetType: Joi.string()
    .uppercase()
    .valid("WEEKLY", "MONTHLY")
    .required()
    .messages({
      "any.only": '"budgetType" must be either WEEKLY or MONTHLY',
      "any.required": '"budgetType" is required'
    }),

  isRecurring: Joi.boolean()
    .default(false)
    .optional(),

  startDate: Joi.date()
    .iso()
    .optional()
    .messages({
      "date.base": '"startDate" must be a valid ISO date'
    }),

  endDate: Joi.date()
    .iso()
    .optional()
    .messages({
      "date.base": '"endDate" must be a valid ISO date'
    })
}).custom((value, helpers) => {
  if (value.startDate && value.endDate) {
    if (new Date(value.endDate) < new Date(value.startDate)) {
      return helpers.message('"endDate" must be greater than or equal to "startDate"');
    }
  } else if ((value.startDate && !value.endDate) || (!value.startDate && value.endDate)) {
    return helpers.message(
      'Both "startDate" and "endDate" must be provided together, or omitted to use the default current period'
    );
  }
  return value;
});

export const updateBudgetSchema = Joi.object({
  categoryId: Joi.string()
    .uuid()
    .allow(null)
    .optional()
    .messages({
      "string.guid": '"categoryId" must be a valid UUID'
    }),

  limitAmount: Joi.number()
    .positive()
    .precision(2)
    .optional()
    .messages({
      "number.base": '"limitAmount" must be a number',
      "number.positive": '"limitAmount" must be greater than zero'
    }),

  budgetType: Joi.string()
    .uppercase()
    .valid("WEEKLY", "MONTHLY")
    .optional()
    .messages({
      "any.only": '"budgetType" must be either WEEKLY or MONTHLY'
    }),

  isRecurring: Joi.boolean()
    .optional(),

  startDate: Joi.date()
    .iso()
    .optional()
    .messages({
      "date.base": '"startDate" must be a valid ISO date'
    }),

  endDate: Joi.date()
    .iso()
    .optional()
    .messages({
      "date.base": '"endDate" must be a valid ISO date'
    })
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update"
  });

export const getBudgetsQuerySchema = Joi.object({
  budgetType: Joi.string()
    .uppercase()
    .valid("WEEKLY", "MONTHLY")
    .optional(),

  categoryId: Joi.string()
    .uuid()
    .optional()
    .messages({
      "string.guid": '"categoryId" must be a valid UUID'
    }),

  active: Joi.boolean()
    .optional(),

  isRecurring: Joi.boolean()
    .optional(),

  page: Joi.number()
    .integer()
    .min(1)
    .default(1),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
});
