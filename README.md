# Merchant chat simulation

## Installation

To install the applicaiton

1. Clone the repo 
2. cd into the repo `cd merchant-chat-backend-gql-app`
3. Install dependencies `npm install`
4. Run the application in watch mode `npm run start:dev` or if you do not wish to run in watch mode `npm run start`
5. To run the e2e tests `npm run test:e2e`


## About

This project is a backend application using graphql server developed using Nestjs for simulating a chat application between customers and merchants.

The application follows a User/Message model which will be explained in detail below.

## User - Message model

For messages to be added in the system, a user must be created with a unique userId and a userName. 
For messages to be generated, a messageId with the content will be added. The message table will contain information about the userId using it to map between a message and user entity.

User : 
  - userId
  - userName

Message :
  - messageId
  - userId
  - message

For the demonstration of the application, I have only added very basic features and basic validations on the backend but, the application can scale in features with more attributes for each of the entities.

The application also takes care of real-time chat using graphql-subscriptions and can be viewd in the graphql playground mode.


## Demo of the application 
[Application Demo](https://www.loom.com/share/2c34157466cc473285cdc576d8e71d5a?sid=31ba0817-4910-4152-8841-857ac46215c7)


### Citations

[E2E Test](https://www.youtube.com/watch?v=LaJi0Gv6T3Q)

[Subscriptions](https://youtu.be/7-eEAJkzYgw?si=QscuXNJyMM67ZDaj)

[nestJs Documentation](https://docs.nestjs.com/)

[nestJs basics](https://youtu.be/iADUPukJlgY?si=435AAUDgxJR9J5Ap)