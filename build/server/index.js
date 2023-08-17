"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const process_1 = require("process");
const auth_routes_1 = require("./features/auth/auth.routes");
const posts_routes_1 = require("./features/posts/posts.routes");
const app = (0, express_1.default)();
exports.prisma = new client_1.PrismaClient();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: '*'
}));
app.get("/", (req, res) => {
    res.json("Welcome");
});
app.use("/auth", auth_routes_1.authRouter);
app.use("/posts", posts_routes_1.postRouter);
app.use((req, res, next) => {
    const error = new Error('Invalid route');
    res.status(404).json({ error: 'Invalid route' });
});
app.listen(process_1.env.PORT, () => {
    console.log(`Server running on PORT : ${process_1.env.PORT}`);
});
