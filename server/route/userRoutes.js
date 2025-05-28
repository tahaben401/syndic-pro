import express from "express"
import { Create,login,getData,getResidents ,deleteUser} from "../controllers/userController.js";
import { getAllFac } from "../controllers/factureController.js";



const route =express.Router();
route.post("/create",Create);
route.post("/get",login);
route.get("/getIMS",getData);
route.get("/residents",getResidents);
route.get("/getAllFact",getAllFac);
route.delete('/users/:id', deleteUser);
export default route;