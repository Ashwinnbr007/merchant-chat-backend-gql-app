import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, NotFoundException } from '@nestjs/common';
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

  describe('User Endpoints', () => {
    // Storing a new testUserId as we will be deleting the instance of the
    // testUser after our tests as I am not having a separate database for test.
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

    // Test updation of a User
    it('should update a user', async () => {
      const response = await request(server)
        .post('/graphql')
        .send({
          query: `
            mutation {
                updateUser(updateUserInput: {
                  userName: "Test user 2",
                  userId: ${testUserId},
                }){
                  userId,
                  userName
                }
              }
          `,
        });
      const { data } = response.body;
      expect(data).toEqual({
        updateUser: {
          userId: testUserId,
          userName: 'Test user',
        },
      });
    });

    it('should not update a user', async () => {
      const response = await request(server)
        .post('/graphql')
        .send({
          query: `
              mutation {
                  updateUser(updateUserInput: {
                    userName: "Test user 2",
                    userId: ${testUserId + 500},
                  }){
                    userId,
                    userName
                  }
                }
            `,
        });
      const { errors } = response.body;
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe(
        `User with userId ${testUserId + 500} not found`,
      );
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
