import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
import { User } from './User';
import Message from './Message';

@Entity()
export default class MessageReplies {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @ManyToOne(() => User, (user) => user.message)
  public author: User;

  @ManyToOne(() => Message, (message) => message.replies)
  public message: Message;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

}
