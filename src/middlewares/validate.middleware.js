const validate = (schema, source = "body") => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[source], { abortEarly: true });

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        if (source === "body") {
            req.body = value;
        } else {
            Object.assign(req[source], value);
        }
        next();
    };
};

export default validate;