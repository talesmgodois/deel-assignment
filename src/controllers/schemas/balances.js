const yup = require('yup');

const balanceSepositSchema = yup.object({
    amount: yup.number().required(),
    userId: yup.number().required()
});

module.exports = {
    balanceSepositSchema,
};
