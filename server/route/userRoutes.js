import express from "express"
import { Create,login } from "../controllers/userController.js";



const route =express.Router();
route.post("/create",Create);
route.post("/get",login);
export default route;