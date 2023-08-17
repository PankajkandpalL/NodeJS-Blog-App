"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const auth_middleware_1 = require("./auth.middleware");
const authRouter = express_1.default.Router();
exports.authRouter = authRouter;
authRouter.post("/user", auth_middleware_1.authMiddleware, auth_controller_1.authController.authOperations);
