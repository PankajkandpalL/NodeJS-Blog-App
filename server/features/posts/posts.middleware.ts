import { Request, Response, NextFunction } from "express";
import { getPermissions, getUserByToken } from "../../utils/validation";

const postReadMiddleware = async( req : Request, res : Response, next : NextFunction ) => {
    try{
        if(!req.headers.token){
            throw new Error("Headers missing!");
        }
        const tokenInfo : any  = getUserByToken(req.headers.token as string);
        const getUserPerms = await getPermissions(tokenInfo);
        if(!tokenInfo || !getUserPerms){
            throw new Error("Token Invalid")
        }
        req.body.permissions = getUserPerms;
        req.body.userRole = tokenInfo.role;
        req.body.userEmail = tokenInfo.email; 
        next();
    }
    catch(e : any){
        return res.status(500).json({ error : true, message : e.message });
    }
}

export { postReadMiddleware };