import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { NotFoundException } from '@nestjs/common/exceptions';
import { MessageService } from 'src/message/message.service';
import { Message } from 'src/message/entities/message.entity';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly messageService: MessageService,
  ) { }

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.userService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('userID', { type: () => Int }) userId: number) {
    return this.userService.findOne(userId);
  }

  @Mutation(() => User)
  async updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    try {
      await this.userService.findOne(updateUserInput.userId);
    } catch {
      throw new NotFoundException(
        `User with userId ${updateUserInput.userId} not found`,
      );
    }
    return this.userService.update(updateUserInput.userId, updateUserInput);
  }

  @Mutation(() => String)
  async removeUser(@Args('userId', { type: () => Int }) userId: number) {
    try {
      await this.userService.findOne(userId);
    } catch {
      return `User with userId ${userId} not found`;
    }
    this.userService.remove(userId);
    return `User with userId ${userId} removed`;
  }

  @ResolveField(() => [Message])
  async findMessages(@Parent() user: User) {
    return await this.messageService.findAllByUserId(user.userId);
  }

  @ResolveField(() => Message)
  async findMessage(
    @Parent() message: Message,
    @Args('messageId', { type: () => Int }) messageId: number,
  ) {
    return await this.messageService.findOne(messageId);
  }
}
