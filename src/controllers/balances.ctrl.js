const { getProfile } = require('../middleware/getProfile');
const { balancesService } = require('../services');
const { validateSchema } = require('./schemas/validateSchema');
const { balanceSepositSchema } = require('./schemas/balances');
const { v4: uuid } = require('uuid');

const setup = (app) => {
    app.post('/balances/deposit/:userId', getProfile ,async (req, res) =>{
        const { userId } = req.params;
        const { amount } = req.body;
        const params = { userId, amount };
        validateSchema(params, balanceSepositSchema);
        const balance = await balancesService.deposit({...params, req, reqId: uuid()})
        if(!balance) return res.status(404).end()
        res.json(balance)
    })
}

module.exports = {
    setup,
}