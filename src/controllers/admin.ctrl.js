const { getProfile } = require('../middleware/getProfile');
const { adminService } = require('../services');
const { validateSchema } = require('./schemas/validateSchema');
const { bestProfessionSchema, bestClientsSchema } = require('./schemas/admin');

const setup = (app) => {
    app.get('/admin/best-profession', getProfile ,async (req, res) =>{
        validateSchema(req.query, bestProfessionSchema)
        const params = {
            req,
            startDate: new Date(req.query.start),
            endDate: new Date(req.query.end),
        }
        const besPrrofession = await adminService.getBestProfessionByDate(params)
        if(!besPrrofession) return res.status(404).end()
        res.json(besPrrofession)
    });

    app.get('/admin/best-clients', getProfile ,async (req, res) =>{
        validateSchema(req.query, bestClientsSchema)
        const params = {
            req,
            startDate: new Date(req.query.start),
            endDate: new Date(req.query.end),
            limit: req.query.limit ?? 2,
        }
        const bestClients = await adminService.getBestClients(params)
        if(!bestClients) return res.status(404).end()
        res.json(bestClients)
    });
}

module.exports = {
    setup,
}