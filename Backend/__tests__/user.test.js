import supertest from "supertest";
import cookie from 'cookie'
import mongoose from 'mongoose'
import app from '../index.js'
import { connect } from "../utils/mongoMemoryServer.js";

describe('User API', () => {
    let adminAuthToken;

    beforeAll(async () => {
        await connect();

        const adminSignup = await supertest(app).post('/sign-up').send({
            firstName: 'Admin',
            lastName: 'User',
            taxId: '123123123123123a',
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
    });
    
    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    describe('GET /users', () => {
        it('should get all users when authenticated as admin', async () => {
            const response = await supertest(app)
                .get('/user')
                .set('Authorization', `Bearer ${adminAuthToken}`);
            
            expect(response.status).toBe(200);
        });

        it('should not get all users without authentication', async () => {
            const response = await supertest(app).get('/user');
            expect(response.status).toBe(401);
        });
    });

    describe('PUT /user/update/:id', () => {
        it('should update a user', async () => {
            const responseSignup = await supertest(app).post('/sign-up').send({
                firstName: 'John',
                lastName: 'Doe',
                taxId: '456456456456456a',
                email: 'john.doe@example.com',
                password: 'password123',
                profilePicture: 'prova.jpg',
            });
            expect(responseSignup.status).toBe(201);

            const loginResponse = await supertest(app).post('/sign-in').send({
                email: 'john.doe@example.com',
                password: 'password123',
            });
            expect(loginResponse.status).toBe(200);
    
            const cookies = cookie.parse(loginResponse.headers['set-cookie'][0]);
            const authToken = cookies.access_token;
    
            const updatedUserResponse = await supertest(app)
                .put(`/user/update/${responseSignup.body.user._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    firstName: 'UpdatedJohn',
                    lastName: 'UpdatedDoe',
                    password: 'updatedpassword',
                    profilePicture: 'updated.jpg',
                });
    
            expect(updatedUserResponse.status).toBe(200);
        });

        it('should not update a user when an invalid image extension is provided', async () => {
            const responseSignup = await supertest(app).post('/sign-up').send({
                firstName: 'John',
                lastName: 'Doe',
                taxId: '456456456456456b',
                email: 'john.doe@exampvle.com',
                password: 'password123',
                profilePicture: 'prova.jpg',
            });
            expect(responseSignup.status).toBe(201);
        
            const loginResponse = await supertest(app).post('/sign-in').send({
                email: 'john.doe@exampvle.com',
                password: 'password123',
            });
            expect(loginResponse.status).toBe(200);
        
            const cookies = cookie.parse(loginResponse.headers['set-cookie'][0]);
            const authToken = cookies.access_token;
        
            const updatedUserResponse = await supertest(app)
                .put(`/user/update/${responseSignup.body.user._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    firstName: 'UpdatedJohn',
                    lastName: 'UpdatedDoe',
                    email: 'updated.john.doe@example.com',
                    password: 'updatedpassword',
                    profilePicture: 'invalid_extension.txt', 
                });
        
            expect(updatedUserResponse.status).toBe(400); 
            expect(updatedUserResponse.body).toHaveProperty('errors');
            expect(updatedUserResponse.body.errors[0]).toHaveProperty('msg', 'Profile picture must be a valid JPEG or PNG image');
        });
    });

    describe('DELETE /user/delete/:id', () => {
        it('should delete a user', async () => {
            const responseSignup = await supertest(app).post('/sign-up').send({
                firstName: 'Marco',
                lastName: 'Rossi',
                taxId: 'MRCRDS9999991234',
                email: 'marco.rossi@example.com',
                password: 'password123',
                profilePicture: 'prova.jpg',
            });
            expect(responseSignup.status).toBe(201);
    
            const loginResponse = await supertest(app).post('/sign-in').send({
                email: 'marco.rossi@example.com',
                password: 'password123',
            });
            expect(loginResponse.status).toBe(200);
    
            const cookies = cookie.parse(loginResponse.headers['set-cookie'][0]);
            const authToken = cookies.access_token;
            console.log(authToken);
    
            const deleteUserResponse = await supertest(app)
                .delete(`/user/delete/${responseSignup.body.user._id}`)
                .set('Authorization', `Bearer ${authToken}`);
    
            expect(deleteUserResponse.status).toBe(200);
        });

        it('should not delete a user with an invalid ID', async () => {
            const responseSignup = await supertest(app).post('/sign-up').send({
                firstName: 'Ada',
                lastName: 'Adda',
                taxId: 'MRCRDS9999991239',
                email: 'ad@example.com',
                password: 'asdasda123',
            });
            expect(responseSignup.status).toBe(201);

            const loginResponse = await supertest(app).post('/sign-in').send({
                email: 'ad@example.com',
                password: 'asdasda123',
            });
            expect(loginResponse.status).toBe(200);
    
            const cookies = cookie.parse(loginResponse.headers['set-cookie'][0]);
            const authToken = cookies.access_token;
    
            const deleteUserResponse = await supertest(app)
                .delete(`/user/delete/invalidUserId`)
                .set('Authorization', `Bearer ${authToken}`);
    
            expect(deleteUserResponse.status).toBe(401);
        });
    });
})