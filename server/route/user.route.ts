import express from "express"
import { UserController } from "../controller/user.controller";

const userController = new UserController();

const router = express.Router();

router.post("/login", userController.login)
router.post("/logout", userController.logout)

router.post("/room", userController.createRoom);// authController.isAuth,
router.get("/room/:id/messages", userController.getMessages);//, authController.isAuth

router.get(`/online`,  userController.getOnlineUsers);//bilo/users/online                authController.isAuth,
router.get(`/all`,  userController.getAllUsers);
router.get(`/idList`, userController.getListOfUsersInfo);

router.get(`/rooms/:userId`, userController.getRoomsForUser); //authController.isAuth, 

router.get("/getInfo", (req, res) => {
    /** @ts-ignore */
    const { user } = req.session;
    if (user) {
      return res.json(user);
    }
    return res.json(null);
  });

export default router;