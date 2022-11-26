const {QueryTypes} = require('sequelize');
const { sequelize } = require("../../model");


const getBestProfessionByDate = async ({startDate, endDate}) => {

    const profession  = await sequelize.query(
        `
            select profession, max(total_received) from (
                select p.profession profession, sum(j.price) total_received from Profiles p
                    left join Contracts c on p.id = c.ContractorId
                    left join Jobs j on c.id = j.ContractId
                    
                where ( j.paymentDate >= :startDate and j.paymentDate <= :endDate )

                GROUP BY P.PROFESSION
            )
    `,  {
        replacements: {
            startDate,
            endDate,
        },
        type: QueryTypes.SELECT,
    });

    return profession[0];
}

const getBestClients = ({startDate, endDate, limit}) => {
    return sequelize.query(
        `
        select p.id, p.firstName name, sum(j.price) total_paid
          from Profiles p
                   left join Contracts c on p.id = c.ClientId
                   left join Jobs j on c.id = j.ContractId

        GROUP BY P.id
        order by total_paid desc 
        limit :limit

    `,  {
        replacements: {
            startDate,
            endDate,
            limit,
        },
        type: QueryTypes.SELECT,
    });
}

module.exports = {
    getBestProfessionByDate,
    getBestClients
};
