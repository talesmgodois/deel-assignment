const { ValidationError } = require("../../utils/errors");

const validateSchema = (payload, schema) => {
    try {
        schema.validateSync(payload);
    } catch (err) {
        throw new ValidationError(err.message);
    }
}

module.exports = {
    validateSchema,
}
