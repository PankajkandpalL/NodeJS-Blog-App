import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from 'cors';
import { env } from "process";
import { authRouter } from "./features/auth/auth.routes";
const app: express.Application = express();
export const prisma = new PrismaClient();

app.use(express.json());
app.use(cors({
    origin: '*'
}));

app.get("/", (req,res)=>{
    res.send("Welcome")
})

app.use("/auth", authRouter)

app.listen(env.PORT, () => {
    console.log( `Server running on PORT : ${env.PORT}` )
} )
