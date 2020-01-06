import { Router, Request, Response } from "express";
import auth from "./auth";
import user from "./user";
import messages from "./messages";
import messageReplies from "./message-replies";

const routes = Router();

routes.use("/auth", auth);
routes.use("/user", user);
routes.use("/messages", messages);
routes.use("/messages-reply", messageReplies);
export default routes;
