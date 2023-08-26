import { Resolver, Query, Mutation, Args, Int, ObjectType } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

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
  removeUser(@Args('userId', { type: () => Int }) userId: number) {
    this.userService.remove(userId);
    return `User with user id ${userId} removed successfully`;
  }
}
