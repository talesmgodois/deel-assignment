const payJobsSchema = yup.object({
    id: yup.number().required(),
});


module.exports = {
    payJobsSchema,
}
