import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { MessageService } from './message.service';
import { Message } from './entities/message.entity';
import { CreateMessageInput } from './dto/create-message.input';
import { UpdateMessageInput } from './dto/update-message.input';
import { NotFoundException } from '@nestjs/common/exceptions';
import { PubSub } from 'graphql-subscriptions';

@Resolver(() => Message)
export class MessageResolver {
  private pubSub: PubSub;
  constructor(private readonly messageService: MessageService) {
    this.pubSub = new PubSub();
  }

  @Mutation(() => Message)
  async createMessage(
    @Args('createMessageInput') createMessageInput: CreateMessageInput,
  ) {
    const newMessage = await this.messageService.create(createMessageInput);
    this.pubSub.publish('listenToAllMessages', {
      listenToAllMessages: newMessage,
    });
    this.pubSub.publish('listenToAMessage', { listenToAMessage: newMessage });
    return newMessage;
  }

  @Subscription(returns => Message, {
    name: 'listenToAllMessages',
  })
  messageAdded() {
    return this.pubSub.asyncIterator('listenToAllMessages');
  }

  @Subscription(returns => Message, {
    name: 'listenToAMessage',
    filter: (payload, variables) => {
      return payload.listenToAMessage.userId === variables.userId;
    },
  })
  userMessage(@Args('userId') userId: number) {
    return this.pubSub.asyncIterator('listenToAMessage');
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
