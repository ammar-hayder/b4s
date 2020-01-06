import { Router } from "express";
import MessageController from "../controllers/MessageController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";


const router = Router();

//Get all messages for ADMIN or MESSAGE_CONTROLLER
router.get("/", [checkJwt, checkRole(["ADMIN", "MESSAGE_CONTROLLER", "USER_TYPE_1" ])], MessageController.listAll);

// Get messages by user id
router.get(
  "/:id([0-9]+)",
  [checkJwt, checkRole(["ADMIN", "MESSAGE_CONTROLLER", "USER_TYPE_1"])],
  MessageController.getMessagesByUserId
);


//Create a new message
router.post("/", [checkJwt, checkRole(["ADMIN", "MESSAGE_CONTROLLER", "USER_TYPE_1"])], 
MessageController.newMessage);

//Edit one message
router.patch(
  "/:id([0-9]+)",
  [checkJwt, checkRole(["ADMIN"])],
  MessageController.editMessage
);

//Delete one message
router.delete(
  "/:id([0-9]+)",
  [checkJwt, checkRole(["ADMIN"])],
  MessageController.deleteMessage
);

export default router;
