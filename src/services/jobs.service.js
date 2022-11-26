
const { Op, QueryTypes } = require("sequelize");
const { sequelize } = require('../model');

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

const pay = ({req, profileId, jobId}) => {

}


module.exports = {
    findUnpaid,
    pay,
}