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

  describe('Message Endpoints', () => {
    // Storing a new testMessageId as we will be deleting the instance of the
    // testMessage after our tests as I am not having a separate database for test.
    let testMessageId;

    // Tests creation of a new message
    it('should return a new message', async () => {
      const response = await request(server)
        .post('/graphql')
        .send({
          query: `
          mutation {
            createMessage(createMessageInput:{
              userId:1,
              message:"this is a test message"
            }){
              userId,
              messageId
              message
            }
          }
          `,
        })
        .expect(200);
      const { data } = response.body;
      expect(data).toEqual({
        createMessage: {
          userId: 1,
          messageId: expect.any(Number),
          message: 'this is a test message',
        },
      });
      testMessageId = data.createMessage.messageId;
    });

    // Test updation of a message
    it('should update a message', async () => {
      const response = await request(server)
        .post('/graphql')
        .send({
          query: `
          mutation {
            updateMessage(updateMessageInput:{
              messageId: ${testMessageId},
              message:"Updated the message with id ${testMessageId}"
            }) {
              messageId,
              message
            }
          }
          `,
        })
        .expect(200);
      const { data } = response.body;
      expect(data).toEqual({
        updateMessage: {
          messageId: testMessageId,
          message: 'this is a test message',
        },
      });
    });

    it('should not update a message', async () => {
      const response = await request(server)
        .post('/graphql')
        .send({
          query: `
          mutation {
            updateMessage(updateMessageInput:{
              messageId: ${testMessageId + 5},
              message:"Updated the message with id ${testMessageId + 5}"
            }) {
              messageId,
              message
            }
          }
            `,
        });
      const { errors } = response.body;
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe(
        `Message with messageId ${testMessageId + 5} not found`,
      );
    });
    // Tests deletion of a message
    it('should delete a message', async () => {
      const response = await request(server)
        .post('/graphql')
        .send({
          query: `
          mutation {
            removeMessage(messageId:${testMessageId})
          }
        `,
        });
      const { data } = response.body;
      expect(data).toEqual({
        removeMessage: `Message with messageId ${testMessageId} removed`,
      });
    });
  });
});
