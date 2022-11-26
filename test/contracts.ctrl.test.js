const request = require('supertest');
const { app } = require('../src/app')


describe('Test suite for admin ctrl', () => {
    describe('contracts by id',  () => {
        it('Should return a 401 code to unauthorized', async () => {
            const res = await request(app)
            .get('/contracts/')
            .send()

            expect(res?.statusCode).toBe(401)
        });
        it('Should result on an 400 input validation error', async () => {
            const res = await request(app)
            .get('/contracts/ss')
            .set('profile_id', 1)
            .send({});

            expect(res?.statusCode).toBe(400)
        });


        it('Should return a sucessful response once it has profile header', async () => {
            const res = await request(app)
            .get(`/contracts/1`)
            .set('profile_id', 1)
            .send();

            expect(res?.statusCode).toBe(200)
        });

    });

    describe('list contracts' , () => {
        it('Should return a 401 code to unauthorized', async () => {
            const res = await request(app)
            .get('/contracts')
            .send()

            expect(res?.statusCode).toBe(401)
        });

        it('Should return a sucessful response, with maximum 2 lines', async () => {
            const res = await request(app)
            .get(`/contracts`)
            .set('profile_id', 1)
            .send();

            expect(res?.statusCode).toBe(200);
            expect(Array.isArray(res.body));
            expect(res.body.length <=2 ).toBe(true);
        });

    });
});
