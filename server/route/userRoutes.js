import express from "express"
import { Create,FetchUser,getData,getResidents,login, UpdateUser,deleteUser } from "../controllers/userController.js";
import { getAllFac } from "../controllers/factureController.js";



const route =express.Router();
route.post("/create",Create);
route.post("/get",login);
route.get("/user/:id",FetchUser)
route.get("/allusers",getResidents)
route.patch("/updateUser/:id",UpdateUser)
route.get("/getIMS",getData);
route.get("/getAllFact",getAllFac)
route.delete('/users/:id', deleteUser);
export default route;