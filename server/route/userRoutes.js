import express from "express"
import { Create,FetchUser,getResidents,login, UpdateUser } from "../controllers/userController.js";



const route =express.Router();
route.post("/create",Create);
route.post("/get",login);
route.get("/user/:id",FetchUser)
route.get("/allusers",getResidents)
route.patch("/updateUser/:id",UpdateUser)
export default route;