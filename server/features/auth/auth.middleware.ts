import { Request, Response, NextFunction } from "express";

const authMiddleware = async(req : Request,res : Response, next : NextFunction) => {
    try{
        if(!req.query.session){
            throw new Error("Missing following query parameters : session" )
        }
        else if(!req.body.email || !req.body.password)
        {
            throw new Error("Missing one of the following properties in body : email, password")
        }
        else{
            next()
        }
    }
    catch(e : any){
        return res.status(404).send({ error : true, message : e.message })
    } 
}

export { authMiddleware }