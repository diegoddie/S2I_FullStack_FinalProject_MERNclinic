import supertest from "supertest";
import cookie from 'cookie'
import mongoose from 'mongoose'
import app from '../index.js'
import { connect } from "../utils/mongoMemoryServer.js";

describe('Doctor API', () => {
    let authToken;
    let doctorPassword;
    let doctorAuthToken;
    let nonAdminAuthToken;
    let doctorId; 

    beforeAll(async () => {
        await connect();

        const responseSignup = await supertest(app).post('/sign-up').send({
            firstName: 'Matteo',
            lastName: 'Mattei',
            taxId: 'ABCABCABCABCABC5',
            email: 'jmate@example.com',
            password: 'password123',
            profilePicture: 'prova.jpg',
            isAdmin: true
        });
        expect(responseSignup.status).toBe(201);

        const loginResponse = await supertest(app).post('/sign-in').send({
            email: 'jmate@example.com',
            password: 'password123',
        });
        expect(loginResponse.status).toBe(200);

        const cookies = cookie.parse(loginResponse.headers['set-cookie'][0]);
        authToken = cookies.access_token;

        const nonAdminResponse = await supertest(app).post('/sign-up').send({
            firstName: 'NonAdmin',
            lastName: 'User',
            taxId: 'ABCABCABCABCABC1',
            email: 'nonadmin@example.com',
            password: 'password123',
            profilePicture: 'nonadmin.jpg',
        });
        expect(nonAdminResponse.status).toBe(201);

        const nonAdminLoginResponse = await supertest(app).post('/sign-in').send({
            email: 'nonadmin@example.com',
            password: 'password123',
        });
        expect(nonAdminLoginResponse.status).toBe(200);

        const nonAdminCookies = cookie.parse(nonAdminLoginResponse.headers['set-cookie'][0]);
        nonAdminAuthToken = nonAdminCookies.access_token;
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    describe('POST /doctor/create', () => {
        it('should create a new doctor', async () => {
            const response = await supertest(app)
                .post('/doctor/create')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com',
                    phoneNumber: '1234567890',
                    specialization: 'Cardiology',
                    city: 'Boston',
                    profilePicture: 'john.jpg',
                });
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'Doctor created successfully and email sent');
            expect(response.body).toHaveProperty('doctor');
            
            doctorPassword = 
            doctorId = response.body.doctor._id
        });

        it('should not create a doctor when a user is not admin', async () => {
            const response = await supertest(app)
                .post('/doctor/create')
                .set('Authorization', `Bearer ${nonAdminAuthToken}`)
                .send({
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com',
                    phoneNumber: '1234567890',
                    specialization: 'Cardiology',
                    city: 'New York',
                    profilePicture: 'john.jpg',
                });

            expect(response.status).toBe(403);
            expect(response.body).not.toHaveProperty('doctor');
        });
    });

    describe('GET /doctor', () => {
        it('should get all doctors', async () => {
            const response = await supertest(app)
                .get('/doctor');

            expect(response.status).toBe(200);
        });
    });

    describe('GET /doctor/:id', () => {
        it('should get a specific doctor by id', async () => {
            const response = await supertest(app)
                .get(`/doctor/${doctorId}`);

            expect(response.status).toBe(200);
        });
    });

    describe('GET /doctor/specialization/:specialization', () => {
        it('should get doctors by specialization', async () => {
            const response = await supertest(app)
                .get('/doctor/specialization/cardiology');

            expect(response.status).toBe(200);
        });
    });

    describe('GET /doctor/lastname/:lastname', () => {
        it('should get doctors by last name', async () => {
            const response = await supertest(app)
                .get('/doctor/lastname/doe');

            expect(response.status).toBe(200);
        });
    });

    describe('GET /doctor/city/:city', () => {
        it('should get doctors by city', async () => {
            const response = await supertest(app)
                .get('/doctor/city/boston');

            expect(response.status).toBe(200);
        });
    });

    describe('DELETE /doctor/delete/:id', () => {
        it('should delete a doctor', async () => {
            const response = await supertest(app)
                .delete(`/doctor/delete/${doctorId}`)
                .set('Authorization', `Bearer ${authToken}`);
            
            expect(response.status).toBe(200);
        });
    });
});
