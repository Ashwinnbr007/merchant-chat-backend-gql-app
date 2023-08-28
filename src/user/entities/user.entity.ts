import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Message } from '../../message/entities/message.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  userId: number;

  @Column()
  @Field()
  userName: string;

  @OneToMany(() => Message, (message) => message.user)
  @Field(() => [Message], { nullable: true })
  messages?: Message[];
}
