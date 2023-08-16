import { Request, Response } from "express";
import {prisma} from '../..';
import { Post, User } from "../../utils/types";

class PostController {
    async readPost(req : Request, res : Response){
        
        const { permissions, userRole, userEmail } = req.body;
 
        try{
            if(permissions.canReadPosts){
                const currentUserPosts  = await prisma.post.findMany({
                    where : {
                        user_id : userEmail,
                        isDeleted : false
                    }
                });

                return res.status(200).json({ error : false, items : currentUserPosts });
            
            }
            throw new Error("Forbidden")
        }
        catch(e : any){
            return res.status(500).json({ error : true, message : e.message });
        }
    }   

    async addPost(req : Request, res : Response) {

        
        const { permissions, userRole, userEmail, title, description, imageSrc } = req.body;        
        
        try{
            if(!req.body.title || !req.body.description || !req.body.imageSrc){
                throw new Error("Properties missing in the body : imageSrc || title || description");
            }
            const userInfo : User | null = await prisma.user.findUnique({
                 where : {
                     email : userEmail
                    }
                });
            if(permissions.canCreatePost && userInfo?.isActive){
                const isPostCreated = await prisma.post.create({
                    data : {
                        title : title,
                        description : description,
                        user_id : userEmail, 
                        imageSrc : imageSrc,
                    }
                });
                return res.status(201).json({ error : false, message : isPostCreated });
            }
            throw new Error("Forbidden, cannot create post")
        }
        catch(e : any){
            return res.status(500).json({ error : true, message : e.message });
        }
        
    }

    async updatePost(req : Request, res : Response){
        
        const { permissions, userRole, userEmail, title, description } = req.body;        
        const { postId } = req.params;

        try{
            if(!req.body.title && !req.body.description){
                throw new Error("Properties missing in the body : title || description");
            }

            const userInfo : User | null = await prisma.user.findUnique({
                 where : {
                     email : userEmail
                    }
                });

            if(permissions.canUpdatePost && userInfo?.isActive){
                const doPostExists = await prisma.post.findFirst({
                    where : {
                        user_id : userEmail,
                        id : Number(postId as string)
                    }
                });

                if(!doPostExists){
                    throw new Error("Invalid post")
                }

                const isPostUdpated = await prisma.post.update({
                    where : {
                        user_id : userEmail,
                        id  : Number(postId as string)
                    },
                    data : {
                        title : title || doPostExists.title,
                        description : description || doPostExists.description
                    }
                })
                return res.json({ error : false, message : isPostUdpated});
            }
            throw new Error("Forbidden, cannot update post")
        }
        catch(e : any){
            return res.status(500).json({ error : true, message : e.message });
        }
    }

    async deletePost(req : Request, res : Response){
        
        const { permissions, userRole, userEmail } = req.body;    
        const { postId } = req.params;

        try{
            
            const userInfo : User | null = await prisma.user.findUnique({
                where : {
                    email : userEmail
                }
            });

            if((permissions.canDeletePost && userInfo?.isActive) || permissions.canDeleteAnyPost){
               
                const doPostExists = await prisma.post.findFirst({
                    where : {
                        user_id : userEmail,
                        id : Number(postId as string)
                    }
                });

                if(!doPostExists || doPostExists.isDeleted){
                    throw new Error("Cannot delete post")
                }

                await prisma.post.update({
                    where : {
                        user_id : userEmail, 
                        id : Number(postId as string)
                    },
                    data : {
                        isDeleted : true,
                        deletedBy : userEmail
                    }
                })   
                
                return res.status(201).json({ error : false, message : "Post deleted successfully" })
            }
            throw new Error("Forbidden")            
        }
        catch(e: any) {
            return res.status(500).json({ error : true , message : e.message });
        }
    }
}

const postController = new PostController();

export { postController };