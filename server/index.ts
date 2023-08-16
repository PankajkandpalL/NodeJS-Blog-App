import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from 'cors';
import { env } from "process";
const app: express.Application = express();
export const prisma = new PrismaClient();

app.use(express.json());
app.use(cors({
    origin: '*'
}));

app.get("/", (req,res)=>{
    res.send("Welcome")
})

app.listen(env.PORT, () => {
    console.log( `Server running on PORT : ${env.PORT}` )
} )
