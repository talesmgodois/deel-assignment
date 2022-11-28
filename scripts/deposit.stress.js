const request = require('supertest');
const { app } = require('../src/app');
const fs = require('fs');

async function deposits () {
    const dir = './log/deposits';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    const calls = 1000;
    const profileIds = [1,2,3,4,5,6,7,8,9];
    let cursor = 0;
    const ids = new Array(calls).fill(1);
    for(let i=0; i< ids.length; i++) {
        ids[i] = profileIds[cursor];
        if(cursor>= profileIds.length) {
            cursor = 0;
        }
        cursor++;
    }
    const deposits = ids.map(id => {
      return request(app).post(`/balances/deposit/${id}`).set('profile_id', 1).send({
        amount: 1
      });
    });
    console.time('time');
    const res = await Promise.all(deposits);
    console.timeEnd('time');
    fs.writeFileSync(`${process.cwd()}/log/deposits/${new Date().getTime()}.log`, res.map(r => JSON.stringify(r.body)).join(';\n'));
}

deposits();