const yup = require('yup');

const contractByIdSchema = yup.object({
    id: yup.number().required()
})

module.exports = {
    contractByIdSchema,
};
