const request = require('supertest');
const { app } = require('../src/app')

describe('Test suite for balances ctrl', () => {
    describe('deposit',  () => {
        it('Should return a 401 code to unauthorized', async () => {
            const res = await request(app)
            .post('/balances/deposit/3')
            .send()

            expect(res?.statusCode).toBe(401)
        });

        it('Should result on an 400 input validation error', async () => {
            const res = await request(app)
            .post('/balances/deposit/3')
            .set('profile_id', 1)
            .send({});

            expect(res?.statusCode).toBe(400)
        });


        it('Should return a sucessful response once it has profile header', async () => {
            const res = await request(app)
            .post(`/balances/deposit/3`)
            .set('profile_id', 1)
            .send({
                amount: 10
            });

            expect(res?.statusCode).toBe(200)
        });
    });
});
