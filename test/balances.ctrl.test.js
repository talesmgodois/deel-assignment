const { v4: uuid } = require('uuid');
const request = require('supertest');
const { app } = require('../src/app')
const { Profile, Contract, Job } = require('../src/model');

describe('Test suite for balances ctrl', () => {
    let toDelete  = [];
    let contractor = null;
    let client = null;
    let contract = null;
    let job = null;
    
    beforeAll( async() => {
        contractor = await Profile.create({
            firstName: 'Contractor' + uuid(),
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
            status: 'in_progress',
            ClientId: client.id,
            ContractorId: contractor.id,
          });

        job  = await Job.create({
            description: 'work',
            price: 10,
            ContractId: contract.id,
          })

        toDelete = [job, contract, client, contractor];
    })

    afterAll(async () => {
        for(const entity of toDelete) {
            await entity.destroy();
        }
    })
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

        it('Should should not be able to deposit more than 25% his total of jobs to pay. ', async () => {
            const res = await request(app)
            .post(`/balances/deposit/${client.id}`)
            .set('profile_id', 1)
            .send({
                amount: 10000
            });

            expect(res?.statusCode).toBe(422)
        });

        it('Should not enable deposit for 25% more than debits on jobs', async () => {
            const shouldFailed = await request(app)
                .post(`/balances/deposit/${client.id}`)
                .set('profile_id', 1)
                .send({
                    amount: 12.6
                });

            const shouldSuccess = await request(app)
                .post(`/balances/deposit/${client.id}`)
                .set('profile_id', 1)
                .send({
                    amount: 12.5
                });


            expect(shouldFailed?.statusCode).toBe(422);
            expect(shouldSuccess?.statusCode).toBe(200);
        })

        it('Should return a sucessful response once it has profile header', async () => {
            const amount = 10;
            
            const res1 = await request(app)
            .post(`/balances/deposit/${client.id}`)
            .set('profile_id', 1)
            .send({
                amount,
            });

            const res2 = await request(app)
            .post(`/balances/deposit/${client.id}`)
            .set('profile_id', 1)
            .send({
                amount,
            });
            console.log({
                res1: res1.body,
                res2: res2.body,
            })
            expect(res1?.statusCode).toBe(200);
            expect(res2?.statusCode).toBe(200);
            expect(res2.body.version > res1.body.version).toBe(true);
            expect(res2.body.balance === (res1.body.balance + amount)).toBe(true);
        });
    });
});
