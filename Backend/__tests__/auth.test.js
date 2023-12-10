import supertest from "supertest";
import cookie from 'cookie'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import app from '../index.js'
import { connect } from "../utils/mongoMemoryServer.js";

describe('Auth API', () => {
    let authToken;

    beforeAll(async () => {
        await connect()
    });
    
    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    describe('POST /sign-up', () => {
        it('should register a new user', async () => {
            const response = await supertest(app).post('/sign-up').send({
                firstName: 'John',
                lastName: 'Doe',
                taxId: '123123123123123a',
                email: 'john.doe@example.com',
                password: 'password123',
                profilePicture: 'prova.jpg'
            });
        
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'User created successfully');
            expect(response.body).toHaveProperty('user');
        });

        it('should not register a new user with an invalid email', async () => {
            const response = await supertest(app).post('/sign-up').send({
                firstName: 'John',
                lastName: 'Doe',
                taxId: '123123123123123b',
                email: 'john.doeexample.com',
                password: 'password123',
            });
        
            expect(response.status).toBe(400);
        });

        it('should not register a new user with an invalid taxId format', async () => {
            const response = await supertest(app).post('/sign-up').send({
                firstName: 'John',
                lastName: 'Doe',
                taxId: '123123123123123',
                email: 'john.doe@eexamplle.com',
                password: 'password123',
            });
        
            expect(response.status).toBe(400);
        });

        it('should not register a new user with an invalid image extension', async () => {
            const response = await supertest(app).post('/sign-up').send({
                firstName: 'John',
                lastName: 'Doe',
                taxId: '123123123123123c',
                email: 'john.doe@eexample.com',
                password: 'password123',
                profilePicture: 'asd.pdf'
            });
            
            expect(response.status).toBe(400);
        });

        it('should not register a new user with an already existed email or TaxId', async () => {
            const response = await supertest(app).post('/sign-up').send({
                firstName: 'John',
                lastName: 'Doe',
                taxId: '123123123123123c',
                email: 'john.doe@example.com',
                password: 'password123',
            });
            
            expect(response.status).toBe(409);
        });

        it('should register an admin user', async () => {
            const response = await supertest(app).post('/sign-up').send({
                firstName: 'Admin',
                lastName: 'User',
                taxId: 'poipoipoipoipoi8',
                email: 'admin@example.com',
                password: 'adminpassword',
                isAdmin: true,  
            });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'User created successfully');
            expect(response.body).toHaveProperty('user');
            expect(response.body.user).toHaveProperty('isAdmin', true);
        });
    });

    describe('POST /sign-in', () => {
        it('should sign in an existing user', async () => {
            const response = await supertest(app).post('/sign-in').send({
                email: 'john.doe@example.com',
                password: 'password123',
            });
    
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('firstName', 'John');
            expect(response.body).toHaveProperty('lastName', 'Doe');
            expect(response.body).toHaveProperty('email', 'john.doe@example.com');
            
            const cookies = cookie.parse(response.headers['set-cookie'][0]);
            const authToken = cookies.access_token;
            expect(authToken).toBeTruthy();
        });

        it('should not sign in with incorrect credentials', async () => {
            const response = await supertest(app).post('/sign-in').send({
                email: 'john.doe@example.com',
                password: 'wrongpassword',
            });
    
            expect(response.status).toBe(401);
        });
    });

    describe('POST /sign-out', () => {
        it('should sign out the user', async () => {
            const loginResponse = await supertest(app).post('/sign-in').send({
                email: 'john.doe@example.com',
                password: 'password123',
            });
            expect(loginResponse.status).toBe(200);
    
            const logoutResponse = await supertest(app)
                .get('/sign-out')
                .set('Cookie', loginResponse.headers['set-cookie']);
    
            expect(logoutResponse.status).toBe(200);
            const cookies = cookie.parse(logoutResponse.headers['set-cookie'][0]);
            const authToken = cookies.access_token;
            expect(authToken).toBe('')
        }); 
    });

    describe('POST /password-reset-request', () => {
        it('should send a password reset email', async () => {
            const signUpResponse = await supertest(app).post('/sign-up').send({
                firstName: 'John',
                lastName: 'Doe',
                taxId: '123123123123123e',
                email: 'reset.user@example.com',
                password: 'password123',
                profilePicture: 'prova.jpg'
            });
            expect(signUpResponse.status).toBe(201);

            const response = await supertest(app).post('/password-reset-request').send({
                email: 'reset.user@example.com',
            })

            expect(response.status).toBe(200);
        });

        it('should return 404 for non-existing user', async () => {
            const response = await supertest(app).post('/password-reset-request').send({
                email: 'nonexisting.user@example.com',
            });

            expect(response.status).toBe(404);
        });
    });

    describe('POST /password-reset', () => {
        it('should reset the password with a valid token', async () => {
            const signUpResponse = await supertest(app).post('/sign-up').send({
                firstName: 'John',
                lastName: 'Doe',
                taxId: '123123123123123y',
                email: 'reset.userr@example.com',
                password: 'password123',
                profilePicture: 'prova.jpg'
            });
            expect(signUpResponse.status).toBe(201);

            const resetPswResponse = await supertest(app).post('/password-reset-request').send({
                email: 'reset.userr@example.com',
            });

            const resetToken = resetPswResponse.body.resetToken;
            console.log(resetToken)
            const response = await supertest(app).post(`/password-reset/${resetToken}`).send({
                newPassword: 'newpassword123',
            });

            expect(response.status).toBe(200);
        });

        it('should return 404 for non-existing token', async () => {
            const nonExistingToken = jwt.sign({ userId: new mongoose.Types.ObjectId() }, process.env.RESET_SECRET, { expiresIn: '1h' });
          
            const response = await supertest(app).post(`/password-reset/${nonExistingToken}`).send({
              newPassword: 'newpassword123',
            });
          
            expect(response.status).toBe(404);
        });
    });
})