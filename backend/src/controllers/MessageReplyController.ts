import { Request, Response } from "express";
import { getRepository, createQueryBuilder } from "typeorm";
import { validate } from "class-validator";

import  Message from "../entity/Message";
import MessageReplies from "../entity/MessageReplies";

class MessageReplyController{

  static newMessageReply = async (req: Request, res: Response) => {
    //Get parameters from the body
    let { messageId, text } = req.body;
    let messageReply = new MessageReplies();
    messageReply.message = messageId;
    messageReply.text = text;
    messageReply.author = res.locals.jwtPayload.userId;
    
    //Validade if the parameters are ok
    const errors = await validate(messageReply);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    //Try to save. If fails, the error will be responced
    const messageRepository = getRepository(MessageReplies);
    
    try {
      await messageRepository.save(messageReply);
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
                            'replyAuthor.id', 
                            'replyAuthor.username',  
                          ])
                    .orderBy('Message.createdAt', 'DESC')
                    .getMany();
    res.send(messages);
  };

  static editMessageReply = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;

    //Get values from the body
    const { text } = req.body;

    //Try to find message on database
    const messageReplyRepository = getRepository(Message);
    let messageReply;
    try {
      messageReply = await messageReplyRepository.findOneOrFail(id);
    } catch (error) {
      //If not found, send a 404 response
      res.status(404).send("messageReply not found");
      return;
    }

    //Validate the new values on model
    messageReply.text = text;
    const errors = await validate(messageReply);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    //Try to safe, if fails, error will be responced
    try {
      await messageReplyRepository.save(messageReply);
    } catch (e) {
      res.status(409).send("messageReply already in use");
      return;
    }
    //After all send a 204 (no content, but accepted) response
    res.status(204).send();
  };

  static deleteMessageReply = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;

    const messageReplyRepository = getRepository(Message);
    let messageReply;
    try {
      messageReply = await messageReplyRepository.findOneOrFail(id);
    } catch (error) {
      res.status(404).send("Message not found");
      return;
    }
    messageReplyRepository.delete(id);

    //After all send a 204 (no content, but accepted) response
    res.status(204).send();
  };
};

export default MessageReplyController;
