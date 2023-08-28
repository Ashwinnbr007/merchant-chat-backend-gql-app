import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('UserResolver (e2e)', () => {
  let app: INestApplication;
  let server;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('User Endpoints', () => {
    let testUserId;
    // Tests creation of a new user
    it('should return a new user', async () => {
      const response = await request(server)
        .post('/graphql')
        .send({
          query: `
          mutation {
            createUser(createUserInput:{
              userName:"Test user"
            }) {
              userId,
              userName
            }
          }
          `,
        })
        .expect(200);
      const { data } = response.body;
      expect(data).toEqual({
        createUser: {
          userId: expect.any(Number),
          userName: 'Test user',
        },
      });
      testUserId = data.createUser.userId;
    });

    // Tests deletion of a user
    it('should delete a user', async () => {
      const response = await request(server)
        .post('/graphql')
        .send({
          query: `
            mutation {
                removeUser(userId:${testUserId}) 
            }
        `,
        });
      const { data } = response.body;
      expect(data).toEqual({
        removeUser: `User with userId ${testUserId} removed`,
      });
    });
  });
});
