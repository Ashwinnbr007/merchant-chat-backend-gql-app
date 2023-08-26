/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) { }

  create(createUserInput: CreateUserInput) {
    const newUser = this.userRepository.create(createUserInput);
    return this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(userId: number): Promise<User> {
    return this.userRepository.findOneOrFail({ where: { userId } });
  }

  update(userId: number, updateUserInput: UpdateUserInput) {
    this.userRepository.update(userId, updateUserInput);
    return this.userRepository.findOneOrFail({ where: { userId } });
  }

  remove(userId: number) {
    return this.userRepository.delete(userId);
  }
}
