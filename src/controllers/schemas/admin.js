const yup = require('yup');

const bestProfessionSchema = yup.object({
    start: yup.date().required(),
    end: yup.date().required(),
});

const bestClientsSchema = yup.object({
    start: yup.date().required(),
    end: yup.date().required(),
    limit: yup.number().optional(),
})

module.exports = {
    bestProfessionSchema,
    bestClientsSchema
}
