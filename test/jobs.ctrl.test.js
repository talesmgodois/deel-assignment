const request = require('supertest');
const { app } = require('../src/app')
const { Profile, Contract, Job } = require('../src/model');

describe('Jobs test suite', () => {
    let toDelete  = [];
    let contractor = null;
    let client = null;
    let contract = null;
    let job = null;

    beforeAll(async () => {
        contractor = await Profile.create({
            firstName: 'Contractor',
            lastName: 'Contractor',
            profession: 'Contractor',
            balance: 0,
            type:'contractor'
          });

        client = await Profile.create({
            firstName: 'CLient',
            lastName: 'Client',
            profession: 'Client',
            balance: 0,
            type:'client'
          });

        contract = await Contract.create({
            terms: 'bla bla bla',
            status: 'terminated',
            ClientId: client.id,
            ContractorId: contractor.id,
          });

        job  = await Job.create({
            description: 'work',
            price: 5000,
            ContractId: contract.id,
          })

        toDelete = [job, contract, client, contractor];
    })

    afterAll(async() => {
        for(const entity of toDelete) {
            await entity.destroy();
        }
    })
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
            .post('/jobs/1/pay')
            .send()

            expect(res?.statusCode).toBe(401)
        });

        it('Try to pay an unexistant job', async () => {
            const res = await request(app)
            .post(`/jobs/0/pay`)
            .set('profile_id', 1)
            .send();

            expect(res?.statusCode).toBe(422)
        });


        it('Job lifecycle check', async () => {

            // try to pay for a job with insuficient balance
            const payment1 = await request(app)
            .post(`/jobs/${job.id}/pay`)
            .set('profile_id', 1)
            .send();

            expect(payment1?.statusCode).toBe(422)


            const deposit = await request(app)
                .post(`/balances/deposit/${client.id}`)
                .set('profile_id', 1)
                .send({
                    amount: 5000
                });


            // try to pay for a job after a deposit
            const payment2 = await request(app)
            .post(`/jobs/${job.id}/pay`)
            .set('profile_id', 1)
            .send();

            expect(payment2?.statusCode).toBe(200);

            // try to pay for a paid job
            const payment3 = await request(app)
            .post(`/jobs/${job.id}/pay`)
            .set('profile_id', 1)
            .send();

            expect(payment3?.statusCode).toBe(422);
        });
    })
})