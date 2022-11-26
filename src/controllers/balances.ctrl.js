const { getProfile } = require('../middleware/getProfile');
const balancesService = require('../services/balances');
const { validateSchema } = require('./schemas/validateSchema');
const { balanceSepositSchema } = require('./schemas/balances');

const setup = (app) => {
    app.post('/balances/deposit/:userId', getProfile ,async (req, res) =>{
        const { userId } = req.params;
        const { amount } = req.body;
        const params = { userId, amount };
        validateSchema(params, balanceSepositSchema);
        const balance = await balancesService.deposit(params)
        if(!balance) return res.status(404).end()
        res.json(balance)
    })
}

module.exports = {
    setup,
}