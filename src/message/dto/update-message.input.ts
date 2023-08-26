import { CreateMessageInput } from './create-message.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMessageInput extends PartialType(CreateMessageInput) {
  @Field(() => Int)
  messageId: number;

  @Field()
  message: string;
}
