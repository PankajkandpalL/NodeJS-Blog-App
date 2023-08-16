import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from 'cors';
import { env } from "process";
import { Request, Response, NextFunction } from "express";
import { authRouter } from "./features/auth/auth.routes";
import { postRouter } from "./features/posts/posts.routes";
const app: express.Application = express();
export const prisma = new PrismaClient();

app.use(express.json());
app.use(cors({
    origin: '*'
}));

app.get("/", (req,res)=>{
    res.json("Welcome")
})

app.use("/auth", authRouter)
app.use("/posts", postRouter)

app.use((req: Request, res: Response, next: NextFunction) => {
    const error = new Error('Invalid route');
    res.status(404).json({ error: 'Invalid route' });
});

app.listen(env.PORT, () => {
    console.log( `Server running on PORT : ${env.PORT}` )
} )
