const { QueryTypes, OptimisticLockError, Transaction } = require('sequelize');
const { sequelize } = require("../model");
const { UnprocessableEntity } = require('../utils/errors');
const { getConfig } = require('../utils/config');

const deposit = async ({ amount, userId, req, reqId }) => {
    const { Profile } = req.app.get('models');
    const transaction = await sequelize.transaction();
    try {
        
        await validateDeposit({ amount, userId, req });
        const profile = await Profile.findOne({
            where: {
                id: userId
            }
        })
        const newBalance = profile.balance + amount;
        profile.balance = newBalance;
        await profile.save();
        await transaction.commit();
        return profile;
    } catch(error) {
        await transaction.rollback();
        if(error instanceof OptimisticLockError) {
            return deposit({amount, userId, req, reqId});
        } else {
            throw error;
        }
    } 
    
}

const validateDeposit = async ({ amount, userId, req }) => {
    const config = getConfig();
    const response = await sequelize.query(`
        select p.id, sum(j.price) totalDebit from Jobs j
            left join Contracts C on j.ContractId = C.id
            left join Profiles P on C.ClientId = P.id
    
        where p.id = :userId and j. paid is null
    `, {
        replacements: {
            userId,
        },
        type: QueryTypes.SELECT,
    });
    const maxDepositAvailable = config.deposit.maxBalanceToDeposit * response[0].totalDebit;
    if(amount > maxDepositAvailable) {
        throw new UnprocessableEntity(`User can't deposit more than ${maxDepositAvailable} right now`);
    }
}

module.exports = {
    deposit,
}