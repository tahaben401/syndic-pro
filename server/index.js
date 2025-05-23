import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import route from "./route/userRoutes.js"
import cors from "cors"

const app =express();
app.use(bodyParser.json());
dotenv.config();
app.use(cors());
const PORT=process.env.PORT || 3000;
const MONGO_URL=process.env.MONGO_URL;
mongoose.connect(MONGO_URL)
        .then(()=>{
            console.log("Db connected success");
            app.listen(PORT,()=>{
                console.log(`Server is running on : http://localhost:${PORT}`)
            });
        })
        .catch((err)=>{
            console.log(err);
        })
 app.use("/api",route);