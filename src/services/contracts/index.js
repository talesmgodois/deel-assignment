const { Op } = require("sequelize");

const findById = ({ req, profileId, id }) =>{
    const { Contract, Profile } = req.app.get('models');
    return Contract.findOne(      
        {
            include: [
                { 
                    model: Profile,
                    attributes: ['id'],
                    as: 'Client',
                },
                {
                    model: Profile,
                    attributes: ['id'],
                    as: 'Contractor',
                }
            ],
            where: {
                [Op.and]: [
                    {
                        [Op.or]: [
                            {
                                Clientid: profileId,
                            }, 
                            {
                                Contractorid: profileId
                            }
                       ]         
                    },
                    {
                        id,
                    }
                ]
            }
        }
    );
};

const findAllByProfile = ({ profileId, req }) =>{
    const { Contract, Profile } = req.app.get('models');
    return Contract.findAll(
        {
            include: [
                { 
                    model: Profile,
                    attributes: ['id'],
                    as: 'Client',
                },
                {
                    model: Profile,
                    attributes: ['id'],
                    as: 'Contractor',
                }
            ],
            where: {
                [Op.and]: [
                    {
                        [Op.or]: [
                            {
                                Clientid: profileId,
                            }, 
                            {
                                Contractorid: profileId
                            }
                       ]         
                    }, 
                    {
                        status: {
                            [Op.notIn]: ["terminated"]
                        }
                    }
                ]
            }
        }
    )
};

module.exports = {
    findAllByProfile,
    findById,
};
