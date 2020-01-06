import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
import { User } from './User';
import MessageReplies from "./MessageReplies"; 

@Entity()
export default class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @ManyToOne(type => User, (user) => user.message)
  public author: User;

  @OneToMany(type => MessageReplies, replies => replies.message)
  replies: MessageReplies[];

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

}
