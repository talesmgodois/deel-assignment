
const { Op, QueryTypes } = require("sequelize");
const { sequelize } = require('../model');
const { UnprocessableEntity } = require("../utils/errors");

const findUnpaid = ({ req, profileId }) => {
    return find({req, profileId, paid: true, statuses:['in_progress']});
}

const find = ({ req, profileId, statuses, paid }) => {
    const { Job } = req.app.get('models');
    return sequelize.query(`
        select j.*
        from Jobs j
            left join Contracts c on c.id = j.ContractId
            left join Profiles client on client.id = c.ClientId
            left join Profiles contractor on contractor.id = c.ContractorId

        where 1=1
            and c.status in (:statuses)
            and j.paid = :paid
            and (
                client.id = :profileId or contractor.id = :profileId
            )
    `, {
        model: Job,
        mapToModel: true,
        replacements: {
            paid,
            statuses,
            profileId,
        },
        type: QueryTypes.SELECT,
    })
}

const pay = async ({req, jobId}) => {
    const { Profile, Job }  = req.app.get('models');
    const transaction = await sequelize.transaction();
    try {
        const job = await getJob({ jobId });

        if(!job) {
            throw new UnprocessableEntity('Job does not exists');
        }
        const {
            price,
            paid,
            clientId,
            clientBalance,
            contractorId,
            contractorBalance,
        } = job;

        if(paid) {
            throw new UnprocessableEntity(`Job ${jobId} is already paid`);
        }

        if(clientBalance < price) {
            throw new UnprocessableEntity(`Insuficient balance, please make a deposit`);
        }

        const client = await Profile.findOne({
            where: {
                id: clientId
            }
        });

        const contractor = await Profile.findOne({
            where: {
                id: contractorId
            }
        });

        client.balance = client.balance - price;
        contractor.balance = contractor.balance + price;
        
        await Promise.all([
            client.save(), 
            contractor.save(),
            Job.update({ paid: true, paymentDate: new Date() }, {where: {id: jobId}})
        ]);
        await transaction.commit();
        return {
            old: {
                clientBalance,
                contractorBalance
            }, 
            updated: {
                clientBalance: client.balance,
                contractorBalance: contractor.balance
            }
            
        }

    } catch(error) {
        await transaction.rollback();
        throw error;
    }
}

const getJob = async ({ jobId }) => {
    const jobs = await sequelize.query(`
        select
            j.id jobId,
            j.price as price,
            j.paid as paid,
            client.id as clientId,
            client.balance as clientBalance,
            contractor.id as contractorId,
            contractor.balance as contractorBalance
        from Jobs j
            left join Contracts c on c.id = j.ContractId
            left join Profiles client on c.ClientId = client.id
            left join Profiles contractor on c.ContractorId = contractor.id

        where j.id = :jobId
    `, {
        replacements: {
            jobId,
        },
        type: QueryTypes.SELECT,
    });

    return jobs[0];
}


module.exports = {
    findUnpaid,
    pay,
}