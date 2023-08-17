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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPermissions = exports.hashingPassword = exports.createNewUserToken = exports.getUserByToken = exports.validatePassword = exports.jwt_secret = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const process_1 = require("process");
const __1 = require("..");
exports.jwt_secret = process_1.env.JWT_SECRET || "masai";
const validatePassword = (plainPassword, hashPassword) => __awaiter(void 0, void 0, void 0, function* () {
    if (hashPassword && plainPassword) {
        return yield bcryptjs_1.default.compare(plainPassword, hashPassword.trim());
    }
    else {
        return false;
    }
});
exports.validatePassword = validatePassword;
const hashingPassword = (password) => {
    var salt = bcryptjs_1.default.genSaltSync(10);
    var hash = bcryptjs_1.default.hashSync(password, salt);
    return hash;
};
exports.hashingPassword = hashingPassword;
const getUserByToken = (accessToken) => {
    if (accessToken) {
        try {
            return jsonwebtoken_1.default.verify(accessToken, exports.jwt_secret);
        }
        catch (error) {
            throw new Error("User is not Authorized");
        }
    }
};
exports.getUserByToken = getUserByToken;
const createNewUserToken = (user) => {
    return jsonwebtoken_1.default.sign(user, exports.jwt_secret);
};
exports.createNewUserToken = createNewUserToken;
const getPermissions = (getTokenInfo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRole = yield __1.prisma.role.findUnique({
            where: {
                type: getTokenInfo.role
            }
        });
        const userPermissions = (yield __1.prisma.permissions.findUnique({
            where: {
                id: userRole === null || userRole === void 0 ? void 0 : userRole.permissionsId
            }
        })) || {};
        if (!getPermissions || !userPermissions) {
            throw new Error("Invalid Token");
        }
        return userPermissions;
    }
    catch (e) {
        return e.message;
    }
});
exports.getPermissions = getPermissions;
