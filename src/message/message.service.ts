import { Injectable } from '@nestjs/common';
import { CreateMessageInput } from './dto/create-message.input';
import { UpdateMessageInput } from './dto/update-message.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
  ) {}

  create(createMessageInput: CreateMessageInput) {
    const newMessage = this.messageRepository.create(createMessageInput);
    return this.messageRepository.save(newMessage);
  }

  async findAll(): Promise<Message[]> {
    return this.messageRepository.find();
  }

  async findAllByUserId(userId: number): Promise<Message[]> {
    return await this.messageRepository.find({ where: { userId: userId } });
  }

  async findOne(messageId: number): Promise<Message> {
    return this.messageRepository.findOneOrFail({
      where: { messageId: messageId },
    });
  }

  update(messageId: number, updateMessageInput: UpdateMessageInput) {
    this.messageRepository.update(messageId, updateMessageInput);
    return this.messageRepository.findOneOrFail({ where: { messageId } });
  }

  remove(userId: number) {
    return this.messageRepository.delete(userId);
  }
}
