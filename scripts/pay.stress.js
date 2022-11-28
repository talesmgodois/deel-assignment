const request = require('supertest');
const { app } = require('../src/app');
const fs = require('fs');

async function payJob () {
    const calls = 1000;
    const jobIds = [29, 31,33];
    let cursor = 0;
    const ids = new Array(calls).fill(1);
    for(let i=0; i< ids.length; i++) {
        ids[i] = jobIds[cursor];
        if(cursor>= jobIds.length) {
            cursor = 0;
        }
        cursor++;
    }
    const payments = ids.map(async id => {
        return request(app).post(`/jobs/${id}/pay`).set('profile_id', 1).send({
            amount: 1
        });
    });
    console.time('time');
    const res = await Promise.all(payments);
    console.timeEnd('time');
    fs.writeFileSync(`${process.cwd()}/log/payments/${new Date().getTime()}.log`, res.map(r => JSON.stringify({body: r.body, text: r.text, statusCode: r.statusCode})).join(';\n'));
}

payJob();