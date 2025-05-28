import express from "express"
<<<<<<< HEAD
import { Create,login,getData,getResidents ,deleteUser} from "../controllers/userController.js";
import { getAllFac } from "../controllers/factureController.js";
=======
import { Create,FetchUser,getResidents,login, UpdateUser } from "../controllers/userController.js";
>>>>>>> 718d53ea0792b15a69ee8aa717d001e9143ddeea



const route =express.Router();
route.post("/create",Create);
route.post("/get",login);
<<<<<<< HEAD
route.get("/getIMS",getData);
route.get("/residents",getResidents);
route.get("/getAllFact",getAllFac);
route.delete('/users/:id', deleteUser);
=======
route.get("/user/:id",FetchUser)
route.get("/allusers",getResidents)
route.patch("/updateUser/:id",UpdateUser)
>>>>>>> 718d53ea0792b15a69ee8aa717d001e9143ddeea
export default route;