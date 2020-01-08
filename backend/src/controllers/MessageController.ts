import { Request, Response } from "express";
import * as _ from 'lodash';
import { getRepository, createQueryBuilder } from "typeorm";
import { validate } from "class-validator";

import  Message from "../entity/Message";
import MessageReplies from "../entity/MessageReplies";

class MessageController{

  static listAll = async (req: Request, res: Response) => {
    //Get users from database
    const messages = await createQueryBuilder("Message")
                        .leftJoinAndSelect("Message.author", "author")
                        .leftJoinAndSelect("Message.replies", "replies")
                        .leftJoinAndSelect('replies.author', 'replyAuthor')
                        .select(['Message.id',
                                'Message.text',
                                'Message.createdAt',
                                'Message.updatedAt',
                                'author.id',
                                'author.username', 
                                'author.createdAt',
                                'author.updatedAt',
                                'replies.id',
                                'replies.text',
                                'replyAuthor.id', 
                                'replyAuthor.username',  
                              ])
                        .orderBy('Message.createdAt', 'DESC')
                        .getMany();

    //Send the users object
    if(messages.length > 0){
      res.send(messages);
    }else{
      res.status(404).send("Message not found");
    }
  };

  static getMessagesByUserId = async(req: Request, res: Response) => {
       const id: number = req.params.id;

    //Get the user from database
    try {
      const messages = await createQueryBuilder("Message")
                        .leftJoinAndSelect("Message.author", "author")
                        .leftJoinAndSelect("Message.replies", "replies")
                        .leftJoinAndSelect('replies.author', 'replyAuthor')
                        .select(['Message.id',
                                'Message.text',
                                'Message.createdAt',
                                'Message.updatedAt',
                                'author.id',
                                'author.username', 
                                'author.createdAt',
                                'author.updatedAt',
                                'replies.id',
                                'replies.text',
                                'replies.createdAt',
                                'replyAuthor.id', 
                                'replyAuthor.username',  
                              ])
                        .where("author.id= :id")
                        .getMany();
      res.send(messages);
    } catch (error) {
      res.status(404).send("Message not found");
    }
  }

  static newMessage= async (req: Request, res: Response) => {
    //Get parameters from the body
    let { text } = req.body;
    let message = new Message();
    message.text = text;
    message.author = res.locals.jwtPayload.userId;
    
    //Validade if the parameters are ok
    const errors = await validate(message);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    //Try to save. If fails, the error will be responced
    const messageRepository = getRepository(Message);
    
    try {
      await messageRepository.save(message);
      
    } catch (e) {
      res.status(409).send(e);
      return;
    }
    const messages = await createQueryBuilder("Message")
                        .leftJoinAndSelect("Message.author", "author")
                        .leftJoinAndSelect("Message.replies", "replies")
                        .leftJoinAndSelect('replies.author', 'replyAuthor')
                        .select(['Message.id',
                                'Message.text',
                                'Message.createdAt',
                                'Message.updatedAt',
                                'author.id',
                                'author.username', 
                                'author.createdAt',
                                'author.updatedAt',
                                'replies.id',
                                'replies.text',
                                'replies.createdAt',
                                'replyAuthor.id', 
                                'replyAuthor.username',  
                              ])
                        .orderBy('Message.createdAt', 'DESC')
                        .getMany();
    //If all ok, send all messages
    res.send(messages);
  };

  static newMessageReply = async (req: Request, res: Response) => {
    //Get parameters from the body
    let { messageId, text } = req.body;
    let messageReply = new MessageReplies();
    messageId = messageId;
    messageReply.text = text;
    messageReply.author = res.locals.jwtPayload.userId;
    
    //Validade if the parameters are ok
    const errors = await validate(messageReply);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    //Try to save. If fails, the error will be responced
    const messageRepliesRepository = getRepository(MessageReplies);
    
    try {
      await messageRepliesRepository.save(messageReply);
    } catch (e) {
      res.status(409).send(e);
      return;
    }
    
    //If all ok, send 201 response
    res.status(201).send("Message reply created");
  };
  static editMessage = async (req: Request, res: Response) => {
       const id = req.params.id;

  
    const { text } = req.body;

    //Try to find message on database
    const messageRepository = getRepository(Message);
    let message;
    try {
      message = await messageRepository.findOneOrFail(id);
    } catch (error) {
      //If not found, send a 404 response
      res.status(404).send({"message":"message not found"});
      return;
    }

    //Validate the new values on model
    message.text = text;
    const errors = await validate(message);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    //Try to safe, if fails, error will be responced
    try {
      await messageRepository.save(message);
    } catch (e) {
      res.status(409).send({"message":"messagename already in use" });
      return;
    }
    const messages = await createQueryBuilder("Message")
                        .leftJoinAndSelect("Message.author", "author")
                        .leftJoinAndSelect("Message.replies", "replies")
                        .leftJoinAndSelect('replies.author', 'replyAuthor')
                        .select(['Message.id',
                                'Message.text',
                                'Message.createdAt',
                                'Message.updatedAt',
                                'author.id',
                                'author.username', 
                                'author.createdAt',
                                'author.updatedAt',
                                'replies.id',
                                'replies.text',
                                'replies.createdAt',
                                'replyAuthor.id', 
                                'replyAuthor.username',  
                              ])
                        .orderBy('Message.createdAt', 'DESC')
                        .getMany();
    //If all ok, send all messages
    res.send(messages);
  };

  static deleteMessage = async (req: Request, res: Response) => {
       const id = req.params.id;

    const messageRepository = getRepository(Message);
    const messageRepliesRepository = getRepository(MessageReplies);
    let message;
    try {
      message =  await createQueryBuilder("Message")
                            .where({"id":id})
                            .leftJoinAndSelect("Message.replies", "replies")
                            .getOne();
      if(message.replies.length >0){
        await messageRepliesRepository.delete(_.map(message.replies, 'id'));
      }
      await messageRepository.delete(id);
    } catch (error) {
      res.status(404).send({"message":error});
      return;
    }
    

    const messages = await createQueryBuilder("Message")
                        .leftJoinAndSelect("Message.author", "author")
                        .leftJoinAndSelect("Message.replies", "replies")
                        .leftJoinAndSelect('replies.author', 'replyAuthor')
                        .select(['Message.id',
                                'Message.text',
                                'Message.createdAt',
                                'Message.updatedAt',
                                'author.id',
                                'author.username', 
                                'author.createdAt',
                                'author.updatedAt',
                                'replies.id',
                                'replies.text',
                                'replies.createdAt',
                                'replyAuthor.id', 
                                'replyAuthor.username',  
                              ])
                        .orderBy('Message.createdAt', 'DESC')
                        .getMany();
    //If all ok, send all messages
    res.send(messages);
  };
};

export default MessageController;
