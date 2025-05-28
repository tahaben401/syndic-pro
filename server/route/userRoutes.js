import express from "express"
import { Create,FetchUser,getData,getResidents,login, UpdateUser,deleteUser,verifyEmail ,getAllImmeubleApp, getImmeublleApp, logout} from "../controllers/userController.js";
import { CreateFact, getFactures,getAllFac,updateFacture } from "../controllers/factureController.js";



const route =express.Router();
route.post("/create",Create);
route.post("/get",login);
route.post("/logout",logout)
route.get("/user/:id",FetchUser)
route.get("/allusers",getResidents)
route.patch("/updateUser/:id",UpdateUser)
route.get("/getIMS",getData);
route.get("/getAllFact",getAllFac)
route.delete('/users/:id', deleteUser);
route.get('/verify/:token', verifyEmail);
route.get("/geImmApp/:id",getImmeublleApp);
route.get("/getAllImmeubleApp",getAllImmeubleApp);
route.post("/addFact",CreateFact);
route.put("/update/:id",updateFacture);
route.get("/getFact/:id",getFactures);
export default route;