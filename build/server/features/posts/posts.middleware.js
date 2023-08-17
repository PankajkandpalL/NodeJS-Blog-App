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
exports.postReadMiddleware = void 0;
const validation_1 = require("../../utils/validation");
const postReadMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.headers.token) {
            throw new Error("Headers missing!");
        }
        const tokenInfo = (0, validation_1.getUserByToken)(req.headers.token);
        const getUserPerms = yield (0, validation_1.getPermissions)(tokenInfo);
        if (!tokenInfo || !getUserPerms) {
            throw new Error("Token Invalid");
        }
        req.body.permissions = getUserPerms;
        req.body.userRole = tokenInfo.role;
        req.body.userEmail = tokenInfo.email;
        next();
    }
    catch (e) {
        return res.status(500).json({ error: true, message: e.message });
    }
});
exports.postReadMiddleware = postReadMiddleware;
