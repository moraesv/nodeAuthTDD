const request = require('supertest')

const app = require('../../src/app')
const truncate = require('../utils/truncate')
const factory = require('../factories')

describe('Authentication', () => {
  beforeEach(async () => {
    await truncate()
  })

  it('should receive JTW token when authenticated with valid creadentials', async () => {
    const user = await factory.create('User', {
      password: '123123',
    })

    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: '123123',
      })

    expect(response.status).toBe(200)
  })

  it('should not authenticate with invalid email', async () => {
    const user = await factory.create('User', {
      email: 'test',
    })

    const response = await request(app)
      .post('/sessions')
      .send({
        email: 'testwrong',
        password: user.password,
      })

    expect(response.status).toBe(401)
  })

  it('should not authenticate with invalid passord', async () => {
    const user = await factory.create('User', {
      password: '123123',
    })

    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: '123456',
      })

    expect(response.status).toBe(401)
  })

  it('should return jwt token when authenticated', async () => {
    const user = await factory.create('User', {
      password: '123123',
    })

    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: '123123',
      })

    expect(response.body).toHaveProperty('token')
  })

  it('should be able to access private routes when authenticated', async () => {
    const user = await factory.create('User', {
      password: '123123',
    })

    const response = await request(app)
      .get('/dashboard')
      .set('Authorization', `Bearer ${user.generateToken()}`)

    expect(response.status).toBe(200)
  })

  it('should not be able to access private routes without jwt token', async () => {
    const response = await request(app).get('/dashboard')

    expect(response.status).toBe(401)
  })

  it('should not be able to access private routes with invalid jwt token', async () => {
    const response = await request(app)
      .get('/dashboard')
      .set('Authorization', 'Bearer 123123')

    expect(response.status).toBe(401)
  })
})
