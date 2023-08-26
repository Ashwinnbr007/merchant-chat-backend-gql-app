import { Resolver, Query, Mutation, Args, Int, ObjectType } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InternalServerErrorException } from '@nestjs/common';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) { }

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
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
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
}
