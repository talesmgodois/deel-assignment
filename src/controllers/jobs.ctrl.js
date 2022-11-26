const { getProfile } = require('../middleware/getProfile');

const jobsService = require('../services/jobs');

const setup = (app) => {
        /**
     * FIX ME!
     * @returns contract by id
     */
    app.get('/jobs/unpaid', getProfile ,async (req, res) =>{
        const { profile } = req;
        const jobs = await jobsService.findUnpaid({
            req,
            profileId: profile.id,
        })
        if(!jobs) return res.status(404).end();
        res.json(jobs);
    });

    /**
     * @decription returns all contracts by a single profile_id
     * @returns contracts by profile_id
     */
    app.post('/jobs/:id/pay', getProfile, async (req, res) =>{
        const { profile } = req;
        const { id } = req.params;
        const job = await jobsService.pay({
            profileId: profile.id,
            jobId: id,
            req
        })
        if(!job) return res.status(404).end()
        res.json(job)
    });
}



module.exports = {
    setup,
}