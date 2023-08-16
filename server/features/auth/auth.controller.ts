import { Request, Response } from "express";
import {prisma} from '../..'
import { createNewUserToken, hashingPassword, validatePassword } from "../../utils/validation";
import { Permission, Role, User } from "../../utils/types";

class AuthController{
    
    static login = async( res: Response, email : string, password : string ) => {
        try{
            const doUserExists : User | null = await prisma.user.findUnique({
                where : {
                    email : email
                }
            }) 

            const checkPasswordValidity : boolean = await validatePassword(password, doUserExists?.password)
            
            if(!checkPasswordValidity){
                throw new Error("Wrong password!")
            }

            if(doUserExists?.roleType)
            {
                const token = createNewUserToken({ email : doUserExists.email, role : doUserExists.roleType })
                return res.status(200).json({ error : false, accessToken : token, email : doUserExists.email, role : doUserExists.roleType  })
            }
            else{
                throw new Error("User do not exists")
            }
        }
        catch(e : any){
            return res.status(500).json({ error : true, message : e.message })
        }
    }

    static register = async(res : Response, email : string, password : string, role = "customer") => {
        
        try{
            
            const doUserExists : User | null = await prisma.user.findUnique({
                where : {
                    email : email
                }
            }) 
            
            if(doUserExists){
                throw new Error("User already exists")
            }
            
            const userCreated = await prisma.user.createMany({data : [{ email : email, password : hashingPassword(password), roleType : role}]})
            
            if(userCreated.count>=1){
                return res.status(200).json({ error : false, message : "User created successfully" })
            }
            else {
                throw new Error("Cannot create user")
            }
        }   
        catch(e : any){
            return res.status(500).json({ error : true, message : e.message })
        }         

    }

    async authOperations(req: Request, res : Response){

        const { email, password } = req.body

            switch(req.query.session){
                case "login" : 
                AuthController.login(res, email, password)
                break;
                case "register" : 
                AuthController.register(res, email, password)
                break;
                default : return res.status(500).json({ error : true, message : "Invalid query scope" })
            }
    }

}

const authController = new AuthController();

export {authController}