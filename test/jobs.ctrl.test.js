const request = require('supertest');
const { app } = require('../src/app')


describe('Jobs test suite', () => {
    describe('unpaid jobs', () => {
        it('Should return a 401 code to unauthorized', async () => {
            const res = await request(app)
            .get('/jobs/unpaid')
            .send()

            expect(res?.statusCode).toBe(401)
        });

        it('Should return a sucessful response', async () => {
            const res = await request(app)
            .get(`/jobs/unpaid`)
            .set('profile_id', 1)
            .send();

            expect(res?.statusCode).toBe(200)
            expect(Array.isArray(res.body)).toBe(true);
        });
    });

    describe('pay for job', () => {

        it('Should return a 401 code to unauthorized', async () => {
            const res = await request(app)
            .get('/jobs/unpaid')
            .send()

            expect(res?.statusCode).toBe(401)
        });

        it('Should return a sucessful response', async () => {
            const res = await request(app)
            .get(`/jobs/unpaid`)
            .set('profile_id', 1)
            .send();

            expect(res?.statusCode).toBe(200)
            expect(Array.isArray(res.body)).toBe(true);
        });
    })
})