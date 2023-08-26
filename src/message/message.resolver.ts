import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MessageService } from './message.service';
import { Message } from './entities/message.entity';
import { CreateMessageInput } from './dto/create-message.input';
import { UpdateMessageInput } from './dto/update-message.input';
import { NotFoundException } from '@nestjs/common/exceptions';

@Resolver(() => Message)
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

  @Mutation(() => Message)
  createMessage(
    @Args('createMessageInput') createMessageInput: CreateMessageInput,
  ) {
    return this.messageService.create(createMessageInput);
  }

  @Query(() => [Message], { name: 'messages' })
  findAll() {
    return this.messageService.findAll();
  }

  @Query(() => Message, { name: 'message' })
  findOne(@Args('messageId', { type: () => Int }) messageId: number) {
    return this.messageService.findOne(messageId);
  }

  @Mutation(() => Message)
  async updateMessage(
    @Args('updateMessageInput') updateMessageInput: UpdateMessageInput,
  ) {
    try {
      await this.messageService.findOne(updateMessageInput.messageId);
    } catch {
      throw new NotFoundException(
        `Message with messageId ${updateMessageInput.messageId} not found`,
      );
    }
    return this.messageService.update(
      updateMessageInput.messageId,
      updateMessageInput,
    );
  }

  @Mutation(() => String)
  async removeUser(@Args('messageId', { type: () => Int }) messageId: number) {
    try {
      await this.messageService.findOne(messageId);
    } catch {
      return `Message with messageId ${messageId} not found`;
    }
    this.messageService.remove(messageId);
    return `Message with messageId ${messageId} removed`;
  }
}
