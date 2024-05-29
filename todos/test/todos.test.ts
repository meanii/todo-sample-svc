import supertest from "supertest";
import { Server } from "../src/server/server";
import { routers } from "../src/app/routes";
import { MongoClient } from "../src/clients";
import { Users } from "./helper/users.helper";
import { describe } from "node:test";


const server = new Server()
server.registerRouter('/todos/v1', routers)

const USERS_SVC_URI = process.env.USERS_SVC_URI ?? `http://localhost:3000`
const MONGO_TEST_URI = process.env.MONGO_URI_TEST_TODOS_SVC ?? `mongodb://localhost:27017/tasks-jest-test`
const client = new MongoClient(MONGO_TEST_URI)

const mockUser = { email: `anilchauhanxda+${new Date().getTime()}@gmail.com`, password: `password:${new Date().getTime()}` }
let mockUserId = ``
let tokens = { accessToken: ``, refreshToken: `` }
const user = new Users(USERS_SVC_URI)


beforeAll(async () => {
    await client.connect()
    mockUserId = (await user.createUser({ ...mockUser, firstName: `Anil`, lastName: `Chauhan`, role: `user` }))?._id
    tokens = (await user.loginUser(mockUser))
})


afterAll(async () => {
    await user.deleteUser(mockUserId, tokens.accessToken)
})

describe(`todos.test.ts`, () => {

    describe(`GET /todos/v1`, () => {
        it(`should return an empty array`, async () => {
            const response = await supertest(server.getExpressApp()).get('/todos/v1').set('Authorization', `Bearer ${tokens.accessToken}`)
            expect(response.status).toBe(200)
            expect(response.body.data).toEqual([])
        })
    });

    describe(`POST /todos/v1`, () => {

        describe(`when the request body is invalid`, () => {
            it(`should return a 400 status code`, async () => {
                const response = await supertest(server.getExpressApp()).post('/todos/v1').set('Authorization', `Bearer ${tokens.accessToken}`)
                expect(response.status).toBe(400)
            })
        });

        describe(`when the request body is valid`, () => {
            it(`should return the created todo`, async () => {
                const response = await supertest(server.getExpressApp()).post('/todos/v1').send({ title: `Test Todo`, description: `Test Description` }).set('Authorization', `Bearer ${tokens.accessToken}`)
                expect(response.status).toBe(201)
                expect(response.body.data.title).toBe(`Test Todo`)
                expect(response.body.data.description).toBe(`Test Description`)
            })
        });

    });


    describe(`GET /todos/v1/:id`, () => {

        describe(`get a todo by id`, () => {
            it(`should return the todo`, async () => {
                const todo = (await supertest(server.getExpressApp()).post('/todos/v1').send({ title: `Test Todo`, description: `Test Description` }).set('Authorization', `Bearer ${tokens.accessToken}`)).body.data
                const response = await supertest(server.getExpressApp()).get(`/todos/v1/${todo._id}`).set('Authorization', `Bearer ${tokens.accessToken}`)
                expect(response.status).toBe(200)
                expect(response.body.data.title).toBe(`Test Todo`)
                expect(response.body.data.description).toBe(`Test Description`)
            })
        });

    });

    describe(`PUT /todos/v1/:id`, () => {

        describe(`update a todo`, () => {
            it(`should return the updated todo`, async () => {
                const todo = (await supertest(server.getExpressApp()).post('/todos/v1').send({ title: `Test Todo`, description: `Test Description` }).set('Authorization', `Bearer ${tokens.accessToken}`)).body.data
                const response = await supertest(server.getExpressApp()).put(`/todos/v1/${todo._id}`).send({ title: `Updated Test Todo`, description: `Updated Test Description` }).set('Authorization', `Bearer ${tokens.accessToken}`)
                expect(response.status).toBe(200)
                expect(response.body.data.title).toBe(`Updated Test Todo`)
                expect(response.body.data.description).toBe(`Updated Test Description`)
            })
        })
    });


    describe(`DELETE /todos/v1/:id`, () => {

        describe(`delete a todo`, () => {
            it(`should return the deleted todo`, async () => {
                const todo = (await supertest(server.getExpressApp()).post('/todos/v1').send({ title: `Test Todo`, description: `Test Description` }).set('Authorization', `Bearer ${tokens.accessToken}`)).body.data
                const response = await supertest(server.getExpressApp()).delete(`/todos/v1/${todo._id}`).set('Authorization', `Bearer ${tokens.accessToken}`)
                expect(response.status).toBe(200)
                expect(response.body.data.title).toBe(`Test Todo`)
                expect(response.body.data.description).toBe(`Test Description`)
            })
        })
    });


});