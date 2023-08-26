import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateMessageInput {
  @Field({ description: 'Content of the message' })
  message: string;
  
  @Field(() => Int)
  userId: number;
}
