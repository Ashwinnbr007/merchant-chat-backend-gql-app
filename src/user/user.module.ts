import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MessageModule } from '../message/message.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), MessageModule],
  providers: [UserResolver, UserService],
})
export class UserModule {}
