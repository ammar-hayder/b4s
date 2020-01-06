import { Router } from "express";
import MessageReplyController from "../controllers/MessageReplyController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

const router = Router();

//Create a new message reply
router.post("/", [checkJwt, checkRole(["ADMIN","MESSAGE_CONTROLLER", "USER_TYPE_1" ])], MessageReplyController.newMessageReply);

//Edit one message message reply
router.patch(
  "/:id([0-9]+)",
  [checkJwt, checkRole(["ADMIN"])],
  MessageReplyController.editMessageReply
);

//Delete one message
router.delete(
  "/:id([0-9]+)",
  [checkJwt, checkRole(["ADMIN"])],
  MessageReplyController.deleteMessageReply
);

export default router;
