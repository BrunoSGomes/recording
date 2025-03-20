import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from '@src/app.module'
import { UserRepository } from '@identityModule/persistence/repository/user.repository'
import request from 'supertest'

describe('UserResolver (e2e)', () => {
  let app: INestApplication
  let userRepository: UserRepository
  let module: TestingModule

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = module.createNestApplication()
    await app.init()
    userRepository = module.get<UserRepository>(UserRepository)
  })

  beforeEach(async () => {
    await userRepository.clear()
  })

  afterAll(async () => {
    await userRepository.clear()
    await module.close()
  })

  describe('Identity - createUser mutation', () => {
    it('creates a new user', async () => {
      const createUserInput = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: 'password123'
      }

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation {
              createUser(CreateUserInput: {
                firstName: "${createUserInput.firstName}",
                lastName: "${createUserInput.lastName}",
                email: "${createUserInput.email}",
                password: "${createUserInput.password}"
              }) {
                id
                firstName
                lastName
                email
              }
            }
          `
        })
      const { id, firstName, lastName, email } = response.body.data.createUser

      expect(id).toBeDefined()
      expect(firstName).toBe(createUserInput.firstName)
      expect(lastName).toBe(createUserInput.lastName)
      expect(email).toBe(createUserInput.email)
    })
    it('throws error for invalid email validation', async () => {
      const createUserInput = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalidemail',
        password: 'password123'
      }

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation {
              createUser(CreateUserInput: {
                firstName: "${createUserInput.firstName}",
                lastName: "${createUserInput.lastName}",
                email: "${createUserInput.email}",
                password: "${createUserInput.password}"
              }) {
                id
                firstName
                lastName
                email
              }
            }
          `
        })
        .expect(200)
      expect(response.body.errors[0].message).toBe(
        `Invalid email: ${createUserInput.email}`
      )
    })
  })
})
