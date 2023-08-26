import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Message {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  messageId: number;

  @Column()
  @Field(() => Int)
  userId: number;

  @Column()
  @Field()
  message: string;

  @ManyToOne(() => User, (user) => user.messages)
  user: User;
}
