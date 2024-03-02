import supertest from "supertest"
import { app } from "../src/application/web.js"
import { logger } from "../src/application/logging.js"
import { createTestUser, removeTestUser } from "./test-util.js"

describe('POST /api/v1/users/register', function () {

    afterEach(async () => {
        await removeTestUser();
    })

    it('should be can register new user', async () => {
        const result = await supertest(app)
            .post('/api/v1/users/register')
            .send({
                name: "Andhika Pratama",
                number_phone: "6285156172708",
                username: "adkprtm",
                email: "test@gmail.com",
                password: "Maklo123!",
                avatar: "/images/profile.jpg",
                role: "ADMIN"
            })
        expect(result.status).toBe(201)
        expect(result.body.data.name).toBe("Andhika Pratama")
        expect(result.body.data.password).toBeUndefined()
    })

    it('should be error validation', async () => {
        const result = await supertest(app)
            .post('/api/v1/users/register')
            .send({
                username: "adkprtm",
                email: "test@gmail.com",
                password: "Maklo123!",
                avatar: "/images/profile.jpg",
                role: "ADMIN"
            })
        expect(result.status).toBe(400)
        expect(result.body.error).toBeDefined()
    })

    it('should be error email already exist', async () => {
        let result = await supertest(app)
            .post('/api/v1/users/register')
            .send({
                name: "Andhika Pratama",
                number_phone: "6285156172708",
                username: "adkprtm",
                email: "test@gmail.com",
                password: "Maklo123!",
                avatar: "/images/profile.jpg",
                role: "ADMIN"
            })
        expect(result.status).toBe(201)
        expect(result.body.data.name).toBe("Andhika Pratama")
        expect(result.body.data.password).toBeUndefined()

        result = await supertest(app)
            .post('/api/v1/users/register')
            .send({
                name: "Andhika Pratama",
                number_phone: "6285156172708",
                username: "adkprtm",
                email: "test@gmail.com",
                password: "Maklo123!",
                avatar: "/images/profile.jpg",
                role: "ADMIN"
            })

        logger.info(result.body)

        expect(result.status).toBe(400)
        expect(result.body.error)
            .toBeDefined()
    })
})

describe('POST /api/v1/users/login', function () {

    beforeEach(async () => {
        await createTestUser();
    })

    afterEach(async () => {
        await removeTestUser();
    })

    it('should be can login and return token', async () => {
        const result = await supertest(app)
            .post('/api/v1/users/login')
            .send({
                email: "test@gmail.com",
                password: "Maklo123!",
            })
        logger.info(result.body)
        expect(result.status).toBe(200)
        expect(result.body.data.token).toBeDefined()
    })

    it('should error validation', async () => {
        const result = await supertest(app)
            .post('/api/v1/users/login')
            .send({
                email: "",
                password: "Maklo123!",
            })
        logger.info(result.body)
        expect(result.status).toBe(400)
        expect(result.body.error).toBeDefined()
    })

    it('should error email or password wrong', async () => {
        const result = await supertest(app)
            .post('/api/v1/users/login')
            .send({
                email: "test@gmail.com",
                password: "Maklo123!!",
            })
        logger.info(result.body)
        expect(result.status).toBe(401)
        expect(result.body.error).toBeDefined()
    })
})

describe('POST /api/v1/users', () => {

    beforeEach(async () => {
        await createTestUser();
    })

    afterEach(async () => {
        await removeTestUser();
    })

    it('should be can login and return token', async () => {
        const resultlogin = await supertest(app)
            .post('/api/v1/users/login')
            .send({
                email: "test@gmail.com",
                password: "Maklo123!",
            })
        logger.info(resultlogin.body)
        expect(resultlogin.status).toBe(200)
        expect(resultlogin.body.data.token).toBeDefined()

        const resultGetCurrent = await supertest(app)
            .post('/api/v1/users')
            .set(`Authorization`, `Bearer ${resultlogin.body.data.token}`)
            .set('Content-Type', 'application/json')
            .send({ email: `test@gmail.com` })

        logger.info(resultGetCurrent.body)
        expect(resultGetCurrent.status).toBe(200)
        expect(resultGetCurrent.body.data.name).toBe("Andhika Pratama")
    })

    it('should be error unauthorized', async () => {
        const resultGetCurrent = await supertest(app)
            .post('/api/v1/users')
            .set('Content-Type', 'application/json')
            .send({ email: `test@gmail.com` })

        logger.info(resultGetCurrent.body)
        expect(resultGetCurrent.status).toBe(401)
        expect(resultGetCurrent.body.error).toBeDefined()
    })
})

describe('GET /api/v1/users', () => {
    beforeEach(async () => {
        await createTestUser();
    })

    afterEach(async () => {
        await removeTestUser();
    })

    it('should be can get all user with role owner and cashier', async () => {
        const resultlogin = await supertest(app)
            .post('/api/v1/users/login')
            .send({
                email: "test@gmail.com",
                password: "Maklo123!",
            })
        logger.info(resultlogin.body)
        expect(resultlogin.status).toBe(200)
        expect(resultlogin.body.data.token).toBeDefined()

        const resultGetAllUser = await supertest(app)
            .get('/api/v1/users')
            .set(`Authorization`, `Bearer ${resultlogin.body.data.token}`)
            .set('Content-Type', 'application/json')

        logger.info(resultGetAllUser.body)
        expect(resultGetAllUser.status).toBe(200)
    })

    it('should be error unauthorized', async () => {
        const result = await supertest(app)
            .get('/api/v1/users')

        logger.info(result.body)
        expect(result.status).toBe(401)
    })
})

describe('PUT /api/v1/users', () => {
    beforeEach(async () => {
        await createTestUser();
    })

    afterEach(async () => {
        await removeTestUser();
    })

    it('should be can update password', async () => {
        const resultlogin = await supertest(app)
            .post('/api/v1/users/login')
            .send({
                email: "test@gmail.com",
                password: "Maklo123!",
            })
        logger.info(resultlogin.body)
        expect(resultlogin.status).toBe(200)
        expect(resultlogin.body.data.token).toBeDefined()

        const resultGetAllUser = await supertest(app)
            .put('/api/v1/users')
            .set(`Authorization`, `Bearer ${resultlogin.body.data.token}`)
            .set('Content-Type', 'application/json')
            .send({ old_password: `Maklo123!`, password: 'Lamongan16!' })

        logger.info(resultGetAllUser.body)
        expect(resultGetAllUser.status).toBe(200)
    })

    it('should be error update when wrong validation password', async () => {
        const resultlogin = await supertest(app)
            .post('/api/v1/users/login')
            .send({
                email: "test@gmail.com",
                password: "Maklo123!",
            })
        logger.info(resultlogin.body)
        expect(resultlogin.status).toBe(200)
        expect(resultlogin.body.data.token).toBeDefined()

        const result = await supertest(app)
            .put('/api/v1/users')
            .set(`Authorization`, `Bearer ${resultlogin.body.data.token}`)
            .set('Content-Type', 'application/json')
            .send({ old_password: `enggakgituah`, password: 'Lamongan16!' })

        logger.info(result.body)
        expect(result.status).toBe(400)
        expect(result.body.error).toBeDefined()

    })

    it('should be error update when wrong old password', async () => {
        const resultlogin = await supertest(app)
            .post('/api/v1/users/login')
            .send({
                email: "test@gmail.com",
                password: "Maklo123!",
            })
        logger.info(resultlogin.body)
        expect(resultlogin.status).toBe(200)
        expect(resultlogin.body.data.token).toBeDefined()

        const result = await supertest(app)
            .put('/api/v1/users')
            .set(`Authorization`, `Bearer ${resultlogin.body.data.token}`)
            .set('Content-Type', 'application/json')
            .send({ old_password: `Yahaha132!`, password: 'Lamongan16!' })

        logger.info(result.body)
        expect(result.status).toBe(401)
        expect(result.body.error).toBeDefined()

    })

    it('should be can update email', async () => {
        const resultlogin = await supertest(app)
            .post('/api/v1/users/login')
            .send({
                email: "test@gmail.com",
                password: "Maklo123!",
            })
        logger.info(resultlogin.body)
        expect(resultlogin.status).toBe(200)
        expect(resultlogin.body.data.token).toBeDefined()

        const resultUpdateEmailUser = await supertest(app)
            .put('/api/v1/users')
            .set(`Authorization`, `Bearer ${resultlogin.body.data.token}`)
            .set('Content-Type', 'application/json')
            .send({ old_email: `test@gmail.com`, email: 'andhikapratama685@gmail.com' })

        logger.info(resultUpdateEmailUser.body)
        expect(resultUpdateEmailUser.status).toBe(200)
    })

    it('should be error update when wrong validation email', async () => {
        const resultlogin = await supertest(app)
            .post('/api/v1/users/login')
            .send({
                email: "test@gmail.com",
                password: "Maklo123!",
            })
        logger.info(resultlogin.body)
        expect(resultlogin.status).toBe(200)
        expect(resultlogin.body.data.token).toBeDefined()

        const result = await supertest(app)
            .put('/api/v1/users')
            .set(`Authorization`, `Bearer ${resultlogin.body.data.token}`)
            .set('Content-Type', 'application/json')
            .send({ old_email: `test.com`, email: 'andhikapratama685@gmail.com' })

        logger.info(result.body)
        expect(result.status).toBe(400)
        expect(result.body.error).toBeDefined()
    })

    it('should be error update when wrong old email', async () => {
        const resultlogin = await supertest(app)
            .post('/api/v1/users/login')
            .send({
                email: "test@gmail.com",
                password: "Maklo123!",
            })
        logger.info(resultlogin.body)
        expect(resultlogin.status).toBe(200)
        expect(resultlogin.body.data.token).toBeDefined()

        const result = await supertest(app)
            .put('/api/v1/users')
            .set(`Authorization`, `Bearer ${resultlogin.body.data.token}`)
            .set('Content-Type', 'application/json')
            .send({ old_email: `akusiapa@gmail.com`, email: 'andhikapratama685@gmail.com' })

        logger.info(result.body)
        expect(result.status).toBe(401)
        expect(result.body.error).toBeDefined()
    })

    it('should be can update name', async () => {
        const resultlogin = await supertest(app)
            .post('/api/v1/users/login')
            .send({
                email: "test@gmail.com",
                password: "Maklo123!",
            })
        logger.info(resultlogin.body)
        expect(resultlogin.status).toBe(200)
        expect(resultlogin.body.data.token).toBeDefined()

        const resultUpdateName = await supertest(app)
            .put('/api/v1/users')
            .set(`Authorization`, `Bearer ${resultlogin.body.data.token}`)
            .set('Content-Type', 'application/json')
            .send({ name: `Andhika Pratama Widiarto` })

        logger.info(resultUpdateName.body)
        expect(resultUpdateName.status).toBe(200)
        expect(resultUpdateName.body.data.name).toBe(`Andhika Pratama Widiarto`)
        expect(resultUpdateName.body.data.username).toBe(`adkprtm`)
    })
})