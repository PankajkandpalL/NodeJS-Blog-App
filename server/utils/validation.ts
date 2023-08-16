import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from 'process';
import { prisma } from "..";
import { Permission, Role } from "./types";

export const jwt_secret = env.JWT_SECRET || "masai";

export interface IUserToken {
  email  : string;
  role : string;
}

const validatePassword = async (
  plainPassword: string,
  hashPassword: string | undefined
) : Promise<boolean> => {
    if(hashPassword && plainPassword){
        return await bcryptjs.compare(plainPassword, hashPassword.trim());
    }
    else{
        return false;
    }
};

const hashingPassword = (password: string) => {
  var salt = bcryptjs.genSaltSync(10);
  var hash = bcryptjs.hashSync(password, salt);
  return hash;
};

const getUserByToken = (accessToken: string) => {
  if (accessToken) {
    try {
      return jwt.verify(accessToken, jwt_secret);
    } catch (error) {
      throw new Error("User is not Authorized");
    }
  }
};
const createNewUserToken = (user: IUserToken) => {
  return jwt.sign(user, jwt_secret);
};

const getPermissions = async(getTokenInfo : any) : Promise<Permission | string | {}> => {
  try{
    const userRole : Role | null = await prisma.role.findUnique({
        where : {
            type : getTokenInfo.role
        }
    })    
    const userPermissions = await prisma.permissions.findUnique({
        where : {
            id : userRole?.permissionsId
        }
    }) || {}

    if(!getPermissions || !userPermissions){
        throw new Error("Invalid Token")
    }

    return userPermissions
  }
  catch(e : any){
    return e.message;
  }
}

export {
  validatePassword,
  getUserByToken,
  createNewUserToken,
  hashingPassword,
  getPermissions
};
