const request = require('supertest');
const { app } = require('../src/app');


async function deposit() {
    console.log('/starting...');
    const ids = new Array(2).fill(1);
    const deposits = ids.map((id) => {
        return request(app)
        .post(`/balances/deposit/${id}`)
        .set('profile_id', 1)
        .send({
            amount: 3000
        });
    })
    const res = await Promise.all(deposits);
    console.log({
        res
    });
    process.exit();
};


deposit();