"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouter = void 0;
const express_1 = __importDefault(require("express"));
const posts_middleware_1 = require("./posts.middleware");
const posts_controller_1 = require("./posts.controller");
const postRouter = express_1.default.Router();
exports.postRouter = postRouter;
postRouter.use(posts_middleware_1.postReadMiddleware);
postRouter.get("/", posts_controller_1.postController.readPost);
postRouter.post("/create", posts_controller_1.postController.addPost);
postRouter.patch("/update/:postId", posts_controller_1.postController.updatePost);
postRouter.delete("/delete/:postId", posts_controller_1.postController.deletePost);
