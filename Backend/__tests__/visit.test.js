import supertest from "supertest";
import cookie from 'cookie'
import mongoose from 'mongoose'
import app from '../index.js'
import { connect } from "../utils/mongoMemoryServer.js";

describe('Visit API', () => {
    let adminAuthToken;
    let userAuthToken;
    let doctorId;
    let userId;

    beforeAll(async () => {
        await connect();

        const adminSignup = await supertest(app).post('/sign-up').send({
            firstName: 'Admin',
            lastName: 'User',
            taxId: 'mnbmnbmnbmnbmnb9',
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
        });
        expect(adminSignup.status).toBe(201);

        const adminLoginResponse = await supertest(app).post('/sign-in').send({
            email: 'admin@example.com',
            password: 'password123',
        });
        expect(adminLoginResponse.status).toBe(200);

        const adminCookies = cookie.parse(adminLoginResponse.headers['set-cookie'][0]);
        adminAuthToken = adminCookies.access_token;

        const userSignup = await supertest(app).post('/sign-up').send({
            firstName: 'Regular',
            lastName: 'User',
            taxId: 'mnbmnbmnbmnbmnb2',
            email: 'user@example.com',
            password: 'password123',
        });
        expect(userSignup.status).toBe(201);
        userId = userSignup.body.user._id;

        const userLoginResponse = await supertest(app).post('/sign-in').send({
            email: 'user@example.com',
            password: 'password123',
        });
        expect(userLoginResponse.status).toBe(200);

        const userCookies = cookie.parse(userLoginResponse.headers['set-cookie'][0]);
        userAuthToken = userCookies.access_token;

        const doctorCreationResponse = await supertest(app)
            .post('/doctor/create')
            .set('Authorization', `Bearer ${adminAuthToken}`)
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doee@example.com',
                phoneNumber: '1234567890',
                specialization: 'Cardiology',
                city: 'Boston',
                profilePicture: 'john.jpg',
            });
        expect(doctorCreationResponse.status).toBe(201);
        doctorId = doctorCreationResponse.body.doctor._id;
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    describe('POST /visit/create', () => {
        it('should create a new visit', async () => {
            const response = await supertest(app)
                .post('/visit/create')
                .set('Authorization', `Bearer ${userAuthToken}`)
                .send({
                    user: userId,
                    doctor: doctorId,
                    date: '2023-12-29T11:00:00Z',
                  });
            expect(response.status).toBe(201);
        });

        it('should not create a new visit if the day is outside of working hours', async () => {
            const response = await supertest(app)
                .post('/visit/create')
                .set('Authorization', `Bearer ${userAuthToken}`)
                .send({
                    user: userId,
                    doctor: doctorId,
                    date: '2023-12-31T12:00:00Z',
                  });
            expect(response.status).toBe(400);
        });

        it('should not create a new visit if the time is outside of working hours', async () => {
            const response = await supertest(app)
                .post('/visit/create')
                .set('Authorization', `Bearer ${userAuthToken}`)
                .send({
                    user: userId,
                    doctor: doctorId,
                    date: '2023-12-29T06:00:00Z',
                  });
            expect(response.status).toBe(400);
        });

        it('should not create a new visit if the Date is in the past', async () => {
            const response = await supertest(app)
                .post('/visit/create')
                .set('Authorization', `Bearer ${userAuthToken}`)
                .send({
                    user: userId,
                    doctor: doctorId,
                    date: '2022-01-01T12:00:00Z', // Date in the past
                });
            expect(response.status).toBe(400);
        });

        it('should not create a new visit if the userId is different from the authenticated user', async () => {
            const anotherUserSignup = await supertest(app).post('/sign-up').send({
                firstName: 'Another',
                lastName: 'User',
                taxId: 'mnbmnbmnbmnbmnb1',
                email: 'anotheruseer@example.com',
                password: 'password123',
            });
            expect(anotherUserSignup.status).toBe(201);
    
            const anotherUserLoginResponse = await supertest(app).post('/sign-in').send({
                email: 'anotheruseer@example.com',
                password: 'password123',
            });
            expect(anotherUserLoginResponse.status).toBe(200);
    
            const anotherUserCookies = cookie.parse(anotherUserLoginResponse.headers['set-cookie'][0]);
            const anotherUserAuthToken = anotherUserCookies.access_token;
    
            const response = await supertest(app)
                .post('/visit/create')
                .set('Authorization', `Bearer ${anotherUserAuthToken}`)
                .send({
                    user: userId, 
                    doctor: doctorId,
                    date: '2023-01-01T12:00:00Z',
                });
            expect(response.status).toBe(403);
        });
    });

    describe('GET /visit', () => {
        it('should get all visits (admin)', async () => {
            const response = await supertest(app)
                .get('/visit')
                .set('Authorization', `Bearer ${adminAuthToken}`);
            expect(response.status).toBe(200);
        });

        it('should not get all visits without authentication', async () => {
            const response = await supertest(app).get('/visit');
            expect(response.status).toBe(401);
        });
    });

    describe('GET /visit/:id', () => {
        it('should get a specific visit', async () => {
            const response = await supertest(app)
                .post('/visit/create')
                .set('Authorization', `Bearer ${userAuthToken}`)
                .send({
                    user: userId,
                    doctor: doctorId,
                    date: '2023-12-28T11:00:00Z',
                  });
            expect(response.status).toBe(201);
            const visitId = response.body.visit.Id;
            const getVisitResponse = await supertest(app)
                .get(`/visit/${visitId}`)
                .set('Authorization', `Bearer ${userAuthToken}`);
            expect(getVisitResponse.status).toBe(200);
        });

        it('should not get a specific visit if the ID of the user authenticated is different from the ID involved in the visit', async () => {
            const anotherUserSignup = await supertest(app).post('/sign-up').send({
                firstName: 'Another',
                lastName: 'User',
                taxId: 'opermbnvjfghkl81',
                email: 'anotheruser@example.com',
                password: 'password123',
            });
            expect(anotherUserSignup.status).toBe(201);
    
            const anotherUserLoginResponse = await supertest(app).post('/sign-in').send({
                email: 'anotheruser@example.com',
                password: 'password123',
            });
            expect(anotherUserLoginResponse.status).toBe(200);
    
            const anotherUserCookies = cookie.parse(anotherUserLoginResponse.headers['set-cookie'][0]);
            const anotherUserAuthToken = anotherUserCookies.access_token;
    
            const response = await supertest(app)
                .post('/visit/create')
                .set('Authorization', `Bearer ${userAuthToken}`)
                .send({
                    user: userId,
                    doctor: doctorId,
                    date: '2023-12-28T09:00:00Z',
                });
            expect(response.status).toBe(201);
            const visitId = response.body.visit.Id;
    
            const getVisitResponse = await supertest(app)
                .get(`/visit/${visitId}`)
                .set('Authorization', `Bearer ${anotherUserAuthToken}`);
            expect(getVisitResponse.status).toBe(403);
        });

        it('should not get a specific visit with an invalid ID', async () => {
            const response = await supertest(app)
                .get('/visit/invalidVisitId')
                .set('Authorization', `Bearer ${userAuthToken}`);
            expect(response.status).toBe(500);
        });
    });

    describe('GET /visit/doctor/:doctorId', () => {
        it('should get visits by doctor ID (admin)', async () => {
            const response = await supertest(app)
                .get(`/visit/doctor/${doctorId}`)
                .set('Authorization', `Bearer ${adminAuthToken}`);
            expect(response.status).toBe(200);
        });

        it('should not get visits by doctor ID without authentication', async () => {
            const response = await supertest(app).get(`/visit/doctor/${doctorId}`);
            expect(response.status).toBe(401);
        });
    });

    describe('GET /visit/user/:userId', () => {
        it('should get visits by user ID', async () => {
            const response = await supertest(app)
                .get(`/visit/user/${userId}`)
                .set('Authorization', `Bearer ${userAuthToken}`);
            expect(response.status).toBe(200);
        });

        it('should not get visits by user ID if user ID is different from authenticated user', async () => {
            const anotherUserSignup = await supertest(app).post('/sign-up').send({
                firstName: 'Another',
                lastName: 'User',
                taxId: 'opermbnvjfghkls2',
                email: 'anotheruser@exammple.com',
                password: 'password123',
            });
            expect(anotherUserSignup.status).toBe(201);

            const anotherUserLoginResponse = await supertest(app).post('/sign-in').send({
                email: 'anotheruser@example.com',
                password: 'password123',
            });
            expect(anotherUserLoginResponse.status).toBe(200);

            const anotherUserCookies = cookie.parse(anotherUserLoginResponse.headers['set-cookie'][0]);
            const anotherUserAuthToken = anotherUserCookies.access_token;

            const response = await supertest(app)
                .get(`/visit/user/${userId}`)
                .set('Authorization', `Bearer ${anotherUserAuthToken}`);
            expect(response.status).toBe(403);
        });
    });

    describe('PUT /visit/update/:id', () => {
        it('should update a visit', async () => {
            const response = await supertest(app)
                .post('/visit/create')
                .set('Authorization', `Bearer ${userAuthToken}`)
                .send({
                    user: userId,
                    doctor: doctorId,
                    date: '2023-12-27T15:00:00Z',
                  });
            expect(response.status).toBe(201);
            const visitId = response.body.visit.Id;

            const updateVisitResponse = await supertest(app)
                .put(`/visit/update/${visitId}`)
                .set('Authorization', `Bearer ${userAuthToken}`)
                .send({
                    user: userId,
                    doctor: doctorId,
                    date: '2023-12-28T17:00:00Z',
                    paid: true,
                });
            expect(updateVisitResponse.status).toBe(201);
        });

        it('should not update a visit with invalid data', async () => {
            const response = await supertest(app)
                .post('/visit/create')
                .set('Authorization', `Bearer ${userAuthToken}`)
                .send({
                    user: userId,
                    doctor: doctorId,
                    date: '2024-01-04T11:00:00Z',
                  });
            expect(response.status).toBe(201);
            const visitId = response.body.visit.Id;

            const updateVisitResponse = await supertest(app)
                .put(`/visit/update/${visitId}`)
                .set('Authorization', `Bearer ${userAuthToken}`)
                .send({
                    user: userId,
                    doctor: doctorId,
                    date: '2022-12-31T15:00:00Z',
                });
            expect(updateVisitResponse.status).toBe(400);
        });

        it('should not update a visit without authentication', async () => {
            const response = await supertest(app)
                .post('/visit/create')
                .set('Authorization', `Bearer ${userAuthToken}`)
                .send({
                    user: userId,
                    doctor: doctorId,
                    date: '2024-01-04T16:00:00Z',
                  });
            expect(response.status).toBe(201);
            const visitId = response.body.visit._id;

            const updateVisitResponse = await supertest(app)
                .put(`/visit/update/${visitId}`)
                .send({
                    user: userId,
                    doctor: doctorId,
                    date: '2023-12-31T15:00:00Z',
                });
            expect(updateVisitResponse.status).toBe(401);
        });

        it('should not update another user\'s visit', async () => {
            const anotherUserSignup = await supertest(app).post('/sign-up').send({
                firstName: 'Another',
                lastName: 'User',
                taxId: 'opermbnvjfghkld2',
                email: 'anotheruser@examplefe.com',
                password: 'password123',
            });
            expect(anotherUserSignup.status).toBe(201);

            const anotherUserLoginResponse = await supertest(app).post('/sign-in').send({
                email: 'anotheruser@examplefe.com',
                password: 'password123',
            });
            expect(anotherUserLoginResponse.status).toBe(200);

            const anotherUserCookies = cookie.parse(anotherUserLoginResponse.headers['set-cookie'][0]);
            const anotherUserAuthToken = anotherUserCookies.access_token;

            const response = await supertest(app)
                .post('/visit/create')
                .set('Authorization', `Bearer ${anotherUserAuthToken}`)
                .send({
                    user: anotherUserSignup.body.user._id,
                    doctor: doctorId,
                    date: '2024-01-05T11:00:00Z',
                });
            expect(response.status).toBe(201);
            const anotherUserVisitId = response.body.visit.Id;

            const updateResponse = await supertest(app)
                .put(`/visit/update/${anotherUserVisitId}`)
                .set('Authorization', `Bearer ${userAuthToken}`)
                .send({
                    user: userId,
                    doctor: doctorId,
                    date: '2023-12-31T15:00:00Z',
                    paid: true,
                });
            expect(updateResponse.status).toBe(403);
        });
    });

    describe('DELETE /visit/delete/:id', () => {
        it('should delete a specific visit', async () => {
            const response = await supertest(app)
                .post('/visit/create')
                .set('Authorization', `Bearer ${userAuthToken}`)
                .send({
                    user: userId,
                    doctor: doctorId,
                    date: '2024-01-12T11:00:00Z',
                  });
            expect(response.status).toBe(201);
            const visitId = response.body.visit.Id;

            const deleteVisitResponse = await supertest(app)
                .delete(`/visit/delete/${visitId}`)
                .set('Authorization', `Bearer ${userAuthToken}`);
            expect(deleteVisitResponse.status).toBe(200);
        });

        it('should not delete a specific visit with an invalid ID', async () => {
            const response = await supertest(app)
                .post('/visit/create')
                .set('Authorization', `Bearer ${userAuthToken}`)
                .send({
                    user: userId,
                    doctor: doctorId,
                    date: '2024-01-12T11:00:00Z',
                  });
            expect(response.status).toBe(201);

            const deleteVisitResponse = await supertest(app)
                .delete('/visit/delete/invalidVisitId')
                .set('Authorization', `Bearer ${userAuthToken}`);
            expect(deleteVisitResponse.status).toBe(500); 
        });

        it('should not delete a specific visit with another user', async () => {
            const response = await supertest(app)
                .post('/visit/create')
                .set('Authorization', `Bearer ${userAuthToken}`)
                .send({
                    user: userId,
                    doctor: doctorId,
                    date: '2024-01-25T11:00:00Z',
                  });
            expect(response.status).toBe(201);
            const visitId = response.body.visit.Id;

            const anotherUserSignup = await supertest(app).post('/sign-up').send({
                firstName: 'Another',
                lastName: 'User',
                taxId: 'opermbnvjfghklx3',
                email: 'annotheruser@example.com',
                password: 'password123',
            });
            expect(anotherUserSignup.status).toBe(201);

            const anotherUserLoginResponse = await supertest(app).post('/sign-in').send({
                email: 'annotheruser@example.com',
                password: 'password123',
            });
            expect(anotherUserLoginResponse.status).toBe(200);

            const anotherUserCookies = cookie.parse(anotherUserLoginResponse.headers['set-cookie'][0]);
            const anotherUserAuthToken = anotherUserCookies.access_token;

            const deleteVisitResponse = await supertest(app)
                .delete(`/visit/delete/${visitId}`)
                .set('Authorization', `Bearer ${anotherUserAuthToken}`);
            expect(deleteVisitResponse.status).toBe(403);
        });
    });
});
