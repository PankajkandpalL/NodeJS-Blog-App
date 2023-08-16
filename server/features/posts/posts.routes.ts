import express from 'express'
import { postReadMiddleware } from './posts.middleware'
import { postController } from './posts.controller'

const postRouter : express.Router = express.Router()

postRouter.use(postReadMiddleware);

postRouter.get( "/", postController.readPost);
postRouter.post("/create", postController.addPost)
postRouter.patch("/update/:postId", postController.updatePost)
postRouter.delete("/delete/:postId", postController.deletePost)

export { postRouter }