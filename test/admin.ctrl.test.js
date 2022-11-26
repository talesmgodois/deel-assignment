const request = require('supertest');
const { app } = require('../src/app')


describe('Test suite for admin ctrl', () => {
    describe('best profession',  () => {
        it('Should return a 401 code to unauthorized', async () => {
            const res = await request(app)
            .get('/admin/best-profession')
            .send()

            expect(res?.statusCode).toBe(401)
        });
        it('Should result on an 400 input validation error', async () => {
            const res = await request(app)
            .get('/admin/best-profession')
            .set('profile_id', 1)
            .send({});

            expect(res?.statusCode).toBe(400)
        });


        it('Should return a sucessful response once it has profile header', async () => {
            const res = await request(app)
            .get(`/admin/best-profession?start='2022-10-01&end=2033-11-10`)
            .set('profile_id', 1)
            .send();

            expect(res?.statusCode).toBe(200)
        });

    });

    describe('best clients' , () => {
        it('Should return a 401 code to unauthorized', async () => {
            const res = await request(app)
            .get('/admin/best-clients')
            .send()
            expect(res?.statusCode).toBe(401)
        });
        it('Should result on an 400 input validation error', async () => {
            const res = await request(app)
            .get('/admin/best-clients')
            .set('profile_id', 1)
            .send({});

            expect(res?.statusCode).toBe(400)
        });


        it('Should return a sucessful response, with maximum 2 lines', async () => {
            const res = await request(app)
            .get(`/admin/best-clients?start='2022-10-01&end=2033-11-10`)
            .set('profile_id', 1)
            .send();

            expect(res?.statusCode).toBe(200);
            expect(Array.isArray(res.body));
            expect(res.body.length <=2 ).toBe(true);
        });

        it('Should return a sucessful response, with maximum 3 lines', async () => {
            const res = await request(app)
            .get(`/admin/best-clients?start='2022-10-01&end=2033-11-10&limit=3`)
            .set('profile_id', 1)
            .send();

            expect(res?.statusCode).toBe(200);
            expect(Array.isArray(res.body));
            expect(res.body.length <=3 ).toBe(true);
        });

    });
});
