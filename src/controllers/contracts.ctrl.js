const { getProfile } = require('../middleware/getProfile');
const { contractsService } = require('../services');
const { contractByIdSchema } = require('./schemas/contracts');
const { validateSchema } = require('./schemas/validateSchema');

const setup = (app) => {
    /**
     * FIX ME!
     * @returns contract by id
     */
    app.get('/contracts/:id', getProfile ,async (req, res) =>{
        validateSchema(req.params, contractByIdSchema)
        const { id } = req.params
        const { profile } = req;
        const contract = await contractsService.findById({
            req,
            id,
            profileId: profile.id,
        })
        if(!contract) return res.status(404).end()
        res.json(contract)
    });

    /**
     * @decription returns all contracts by a single profile_id
     * @returns contracts by profile_id
     */
    app.get('/contracts', getProfile, async (req, res) =>{
        const { profile } = req;
        const contract = await contractsService.findAllByProfile({
            profileId: profile.id,
            req
        })
        if(!contract) return res.status(404).end()
        res.json(contract)
    });
}

module.exports = {
    setup,
}