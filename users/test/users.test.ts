import supertest from "supertest";
import { Server } from "../src/server/server";
import { routers } from "../src/app/routes";
import { MongoClient } from "../src/clients";

const server = new Server()
server.registerRouter('/users/v1', routers)

const MONGO_TEST_URI = process.env.MONGO_URI_TEST_USERS_SVC ?? `mongodb://localhost:27017/users-jest-test`
const client = new MongoClient(MONGO_TEST_URI)
beforeAll(async () => {
    await client.connect()
})

const mockUser = { email: `anilchauhanxda+${new Date().getTime()}@gmail.com`, password: `password:${new Date().getTime()}`, accessToken: ``, refreshToken: ``, _id: `` };
const mockAdminUser = { email: `anilchauhanxda+${new Date().getTime()+1}@gmail.com`, password: `password:${new Date().getTime()}`, accessToken: ``, refreshToken: ``, _id: `` };


describe(`users.test.ts`, () => {

    describe(`POST /users`, () => {

        describe(`create normal user`, () => {
            it(`should return 201`, async () => {
                const response = await supertest(server.getExpressApp())
                    .post(`/users/v1`)
                    .send({
                        firstName: `Anil`,
                        lastName: `Chauhan`,
                        role: `user`,
                        email: mockUser.email,
                        password: mockUser.password,
                    })
                    .expect(201);
                
                mockUser._id = response.body.data._id;
                expect(response.status).toBe(201);
            });
        });

        describe(`create admin user`, () => {
            it(`should return 201`, async () => {
                const response = await supertest(server.getExpressApp())
                    .post(`/users/v1`)
                    .send({
                        firstName: `Anil`,
                        lastName: `Chauhan`,
                        role: `admin`,
                        email: mockAdminUser.email,
                        password: mockAdminUser.password,
                    })
                    .expect(201);
                
                mockAdminUser._id = response.body.data._id;
                expect(response.status).toBe(201);
            });
        });

        describe(`invalid email and password`, () => {
            it(`should return 400`, async () => {
                const response = await supertest(server.getExpressApp())
                    .post(`/users/v1`)
                    .send({
                        firstName: `Anil`,
                        lastName: `Chauhan`,
                        role: `user`,
                        email: `anilchauhanxdagmail.com`,
                        password: `password`,
                    })
                    .expect(400);

                expect(response.status).toBe(400);
            });
        });

        describe(`duplicate email`, () => {
            it(`should return 409`, async () => {
                const payload = {
                    firstName: `Anil`,
                    lastName: `Chauhan`,
                    role: `user`,
                    email: `anilchauhanxda@gmail.com`,
                    password: `password`,
                }
                await supertest(server.getExpressApp())
                    .post(`/users/v1`)
                    .send(payload)
                const response = await supertest(server.getExpressApp())
                    .post(`/users/v1`)
                    .send(payload)
                    .expect(409);
                
                expect(response.status).toBe(409);
            }); 
        });


        describe(`missing email and password`, () => {
            it(`should return 400`, async () => {
                const response = await supertest(server.getExpressApp())
                    .post(`/users/v1`)
                    .send({
                        firstName: `Anil`,
                        lastName: `Chauhan`,
                        role: `user`,
                    })
                    .expect(400);

                expect(response.status).toBe(400);
            });
        })


    });

    describe(`POST /users/v1/auth/login`, () => {

        describe(`login normal user`, () => {
            it(`should return 200`, async () => {
                const response = await supertest(server.getExpressApp())
                    .post(`/users/v1/auth/login`)
                    .send({
                        email: mockUser.email,
                        password: mockUser.password,
                    })
                    .expect(200);

                expect(response.status).toBe(200);
                expect(response.body.data.accessToken).toBeDefined();
                expect(response.body.data.refreshToken).toBeDefined();
                mockUser.accessToken = response.body.data.accessToken;
                mockUser.refreshToken = response.body.data.refreshToken;
            });
        });

        describe(`login admin user`, () => {
            it(`should return 200`, async () => {
                const response = await supertest(server.getExpressApp())
                    .post(`/users/v1/auth/login`)
                    .send({
                        email: mockAdminUser.email,
                        password: mockAdminUser.password,
                    })
                    .expect(200);

                expect(response.status).toBe(200);
                expect(response.body.data.accessToken).toBeDefined();
                expect(response.body.data.refreshToken).toBeDefined();
                mockAdminUser.accessToken = response.body.data.accessToken;
                mockAdminUser.refreshToken = response.body.data.refreshToken;
            });
        });

        describe(`invalid email and password`, () => {
            it(`should return 400`, async () => {
                const response = await supertest(server.getExpressApp())
                    .post(`/users/v1/auth/login`)
                    .send({
                        email: `anilchauhanxdagmail.com`,
                        password: `password`,
                    })
                    .expect(400);

                expect(response.status).toBe(400);
            });
        });

        describe(`missing email and password`, () => {
            it(`should return 400`, async () => {
                const response = await supertest(server.getExpressApp())
                    .post(`/users/v1/auth/login`)
                    .send({})
                    .expect(400);

                expect(response.status).toBe(400);
            });
        });

    });

    describe(`POST /users/v1/auth/refresh-token`, () => {

        describe(`refresh token`, () => {
            it(`should return 200`, async () => {
                const response = await supertest(server.getExpressApp())
                    .post(`/users/v1/auth/refresh-token`)
                    .send({
                        refreshToken: mockUser.refreshToken,
                    })
                    .expect(200);
    
                expect(response.status).toBe(200);
                expect(response.body.data.accessToken).toBeDefined();
                expect(response.body.data.refreshToken).toBeDefined();
            });
        });

        describe(`invalid refresh token`, () => {
            it(`should return 400`, async () => {
                const response = await supertest(server.getExpressApp())
                    .post(`/users/v1/auth/refresh-token`)
                    .send({})
                    .expect(400);
    
                expect(response.status).toBe(400);
            });
        });

    });

    describe(`POST /users/v1/auth/verify`, () => {

        describe(`verify token`, () => {
            it(`should return 200`, async () => {
                const response = await supertest(server.getExpressApp())
                    .post(`/users/v1/auth/verify`)
                    .set('Authorization', `Bearer ${mockUser.accessToken}`)
                    .set('Content-Type', 'application/json')
                    .send({})
                    .expect(200);
    
                expect(response.status).toBe(200);
            });
        });

        describe(`invalid token`, () => {
            it(`should return 401`, async () => {
                const response = await supertest(server.getExpressApp())
                    .post(`/users/v1/auth/verify`)
                    .send({})
                    .expect(401);
    
                expect(response.status).toBe(401);
            });
        });

    });

    describe(`GET /users/v1`, () => {

        describe(`get all normal user`, () => {
            it(`should return 200`, async () => {
                const response = await supertest(server.getExpressApp())
                    .get(`/users/v1`)
                    .set('Authorization', `Bearer ${mockAdminUser.accessToken}`)
                    .expect(200);
    
                expect(response.status).toBe(200);
            });
        });

        describe(`getting all users without token`, () => {
            it(`should return 401`, async () => {
                const response = await supertest(server.getExpressApp())
                    .get(`/users/v1`)
                    .expect(401);
    
                expect(response.status).toBe(401);
            });
        });

    });

    describe(`PUT /users/v1/:id`, () => {
            
            describe(`update normal user`, () => {
                it(`should return 200`, async () => {
                    const response = await supertest(server.getExpressApp())
                        .put(`/users/v1/${mockUser._id}`)
                        .set('Authorization', `Bearer ${mockUser.accessToken}`)
                        .send({
                            lastName: `Chauhan - Update (${new Date().getTime()})`
                        })
                        .expect(200);
        
                    expect(response.status).toBe(200);
                });
            });

            describe(`normal user trying to update admin user`, () => {
                it(`should return 401`, async () => {
                    const response = await supertest(server.getExpressApp())
                        .put(`/users/v1/${mockAdminUser._id}`)
                        .set('Authorization', `Bearer ${mockUser.accessToken}`)
                        .send({
                            lastName: `Chauhan - Update (${new Date().getTime()})`
                        })
                        .expect(401);
        
                    expect(response.status).toBe(401);
                });
            });

    });

    describe(`DELETE /users/v1/:id`, () => {
            
            describe(`delete normal user`, () => {
                it(`should return 200`, async () => {
                    const response = await supertest(server.getExpressApp())
                        .delete(`/users/v1/${mockUser._id}`)
                        .set('Authorization', `Bearer ${mockUser.accessToken}`)
                        .expect(200);
        
                    expect(response.status).toBe(200);
                });
            });

            describe(`delete admin user`, () => {
                it(`should return 200`, async () => {
                    const response = await supertest(server.getExpressApp())
                        .delete(`/users/v1/${mockAdminUser._id}`)
                        .set('Authorization', `Bearer ${mockAdminUser.accessToken}`)
                        .expect(200);
        
                    expect(response.status).toBe(200);
                })
            })
    
    });

});