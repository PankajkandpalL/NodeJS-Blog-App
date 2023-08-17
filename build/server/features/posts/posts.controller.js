"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postController = void 0;
const __1 = require("../..");
class PostController {
    readPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { permissions, userRole, userEmail } = req.body;
            try {
                if (permissions.canReadPosts) {
                    const currentUserPosts = yield __1.prisma.post.findMany({
                        where: {
                            user_id: userEmail,
                            isDeleted: false
                        }
                    });
                    return res.status(200).json({ error: false, items: currentUserPosts });
                }
                throw new Error("Forbidden");
            }
            catch (e) {
                return res.status(500).json({ error: true, message: e.message });
            }
        });
    }
    addPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { permissions, userRole, userEmail, title, description, imageSrc } = req.body;
            try {
                if (!req.body.title || !req.body.description || !req.body.imageSrc) {
                    throw new Error("Properties missing in the body : imageSrc || title || description");
                }
                const userInfo = yield __1.prisma.user.findUnique({
                    where: {
                        email: userEmail
                    }
                });
                if (permissions.canCreatePost && (userInfo === null || userInfo === void 0 ? void 0 : userInfo.isActive)) {
                    const isPostCreated = yield __1.prisma.post.create({
                        data: {
                            title: title,
                            description: description,
                            user_id: userEmail,
                            imageSrc: imageSrc,
                        }
                    });
                    return res.status(201).json({ error: false, message: isPostCreated });
                }
                throw new Error("Forbidden, cannot create post");
            }
            catch (e) {
                return res.status(500).json({ error: true, message: e.message });
            }
        });
    }
    updatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { permissions, userRole, userEmail, title, description } = req.body;
            const { postId } = req.params;
            try {
                if (!req.body.title && !req.body.description) {
                    throw new Error("Properties missing in the body : title || description");
                }
                const userInfo = yield __1.prisma.user.findUnique({
                    where: {
                        email: userEmail
                    }
                });
                if (permissions.canUpdatePost && (userInfo === null || userInfo === void 0 ? void 0 : userInfo.isActive)) {
                    const doPostExists = yield __1.prisma.post.findFirst({
                        where: {
                            user_id: userEmail,
                            id: Number(postId)
                        }
                    });
                    if (!doPostExists) {
                        throw new Error("Invalid post");
                    }
                    const isPostUdpated = yield __1.prisma.post.update({
                        where: {
                            user_id: userEmail,
                            id: Number(postId)
                        },
                        data: {
                            title: title || doPostExists.title,
                            description: description || doPostExists.description
                        }
                    });
                    return res.json({ error: false, message: isPostUdpated });
                }
                throw new Error("Forbidden, cannot update post");
            }
            catch (e) {
                return res.status(500).json({ error: true, message: e.message });
            }
        });
    }
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { permissions, userRole, userEmail } = req.body;
            const { postId } = req.params;
            try {
                const userInfo = yield __1.prisma.user.findUnique({
                    where: {
                        email: userEmail
                    }
                });
                if ((permissions.canDeletePost && (userInfo === null || userInfo === void 0 ? void 0 : userInfo.isActive)) || permissions.canDeleteAnyPost) {
                    const doPostExists = yield __1.prisma.post.findFirst({
                        where: {
                            user_id: userEmail,
                            id: Number(postId)
                        }
                    });
                    if (!doPostExists || doPostExists.isDeleted) {
                        throw new Error("Cannot delete post");
                    }
                    yield __1.prisma.post.update({
                        where: {
                            user_id: userEmail,
                            id: Number(postId)
                        },
                        data: {
                            isDeleted: true,
                            deletedBy: userEmail
                        }
                    });
                    return res.status(201).json({ error: false, message: "Post deleted successfully" });
                }
                throw new Error("Forbidden");
            }
            catch (e) {
                return res.status(500).json({ error: true, message: e.message });
            }
        });
    }
}
const postController = new PostController();
exports.postController = postController;
