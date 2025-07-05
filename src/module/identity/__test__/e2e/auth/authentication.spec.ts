import { userFactory } from '@identityModule/__test__/factory/user.factory'
import { IdentityModule } from '@identityModule/identity.module'
import { INestApplication } from '@nestjs/common'
import { TestingModule } from '@nestjs/testing'
import { Tables } from '@testInfra/enum/table.enum'
import { testDbClient } from '@testInfra/knex.database'
import { createNestApp } from '@testInfra/test-e2e.setup'
import nock from 'nock'
import request from 'supertest'

describe('AuthResolver (e2e)', () => {
  let app: INestApplication
  let module: TestingModule

  beforeAll(async () => {
    const nestTestSetup = await createNestApp([IdentityModule])
    app = nestTestSetup.app
    module = nestTestSetup.module
  })

  beforeEach(async () => {
    await testDbClient(Tables.User).del()
    await testDbClient(Tables.Subscription).del()
    await testDbClient(Tables.Plan).del()
  })
  afterAll(async () => {
    await testDbClient(Tables.User).del()
    await testDbClient(Tables.Subscription).del()
    await testDbClient(Tables.Plan).del()
    await module.close()
  })

  describe('signIn mutation', () => {
    it('returns accessToken for valid credentials', async () => {
      const signInInput = {
        email: 'johndoe@example.com',
        password: 'password123'
      }
      const user = userFactory.build({
        firstName: 'John',
        lastName: 'Doe',
        email: signInInput.email
      })
      await testDbClient(Tables.User).insert(user)
      nock('https://localhost:3000', {
        encodedQueryParams: true,
        reqheaders: {
          Authorization: (): boolean => true
        }
      })
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .get(`/subscription/user/${user.id}/active`)
        .reply(200, {
          isActive: true
        })

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation {
              signIn(SignInInput: {
                email: "${signInInput.email}",
                password: "${signInInput.password}"
              }) {
                accessToken
              }
            }
          `
        })
        .expect(200)

      expect(response.body.data.signIn.accessToken).toBeDefined()
    })
    it('returns unauthorized if the user does not exist', async () => {
      const signInInput = {
        email: 'johndoe@example.com',
        password: 'password123'
      }

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation {
              signIn(SignInInput: {
                email: "${signInInput.email}",
                password: "${signInInput.password}"
              }) {
                accessToken
              }
            }
          `
        })
        .expect(200)
      expect(response.body.errors[0].message).toEqual(
        'Cannot authorize user: johndoe@example.com'
      )
    })
    it('returns unauthorized if the subscription is not active', async () => {
      const signInInput = {
        email: 'johndoe@example.com',
        password: 'password123'
      }

      const user = userFactory.build({
        firstName: 'John',
        lastName: 'Doe',
        email: signInInput.email
      })
      await testDbClient(Tables.User).insert(user)
      nock('https://localhost:3000', {
        encodedQueryParams: true,
        reqheaders: {
          Authorization: (): boolean => true
        }
      })
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .get(`/subscription/user/${user.id}/active`)
        .reply(200, {
          isActive: false
        })

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation {
              signIn(SignInInput: {
                email: "${signInInput.email}",
                password: "${signInInput.password}"
              }) {
                accessToken
              }
            }
          `
        })
        .expect(200)
      expect(response.body.errors[0].message).toEqual(
        'User subscription is not active: johndoe@example.com'
      )
    })
  })
  describe('getProfile query', () => {
    //Used in examples about module to module calls, its skiped because the default is to use local calls
    it('returns the authenticated user - USING HTTP for module to module calls', async () => {
      const signInInput = {
        email: 'johndoe@example.com',
        password: 'password123'
      }
      const user = userFactory.build({
        firstName: 'John',
        lastName: 'Doe',
        email: signInInput.email
      })
      await testDbClient(Tables.User).insert(user)
      nock('https://localhost:3000', {
        encodedQueryParams: true,
        reqheaders: {
          Authorization: (): boolean => true
        }
      })
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .get(`/subscription/user/${user.id}/active`)
        .reply(200, {
          isActive: true
        })

      const acessTokenResponse = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation {
              signIn(SignInInput: {
                email: "${signInInput.email}",
                password: "${signInInput.password}"
              }) {
                accessToken
              }
            }
          `
        })
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set(
          'Authorization',
          `Bearer ${acessTokenResponse.body.data.signIn.accessToken}`
        )
        .send({
          query: `
            query {
              getProfile {
                email
              }
            }
          `
        })

      const { email } = response.body.data.getProfile

      expect(email).toEqual(signInInput.email)
    })
    it('returns unauthorized for invalid tokens', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer fake-token`)
        .send({
          query: `
            query {
              getProfile {
                email
              }
            }
          `
        })

      expect(response.body.errors[0].message).toEqual('Unauthorized')
    })
  })
})
