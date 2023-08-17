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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const __1 = require("../..");
const validation_1 = require("../../utils/validation");
class AuthController {
    authOperations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            switch (req.query.session) {
                case "login":
                    AuthController.login(res, email, password);
                    break;
                case "register":
                    AuthController.register(res, email, password);
                    break;
                default: return res.status(500).json({ error: true, message: "Invalid query scope" });
            }
        });
    }
}
_a = AuthController;
AuthController.login = (res, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doUserExists = yield __1.prisma.user.findUnique({
            where: {
                email: email
            }
        });
        const checkPasswordValidity = yield (0, validation_1.validatePassword)(password, doUserExists === null || doUserExists === void 0 ? void 0 : doUserExists.password);
        if (!checkPasswordValidity) {
            throw new Error("Wrong password!");
        }
        if (doUserExists === null || doUserExists === void 0 ? void 0 : doUserExists.roleType) {
            const token = (0, validation_1.createNewUserToken)({ email: doUserExists.email, role: doUserExists.roleType });
            return res.status(200).json({ error: false, accessToken: token, email: doUserExists.email, role: doUserExists.roleType });
        }
        else {
            throw new Error("User do not exists");
        }
    }
    catch (e) {
        return res.status(500).json({ error: true, message: e.message });
    }
});
AuthController.register = (res, email, password, role = "customer") => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doUserExists = yield __1.prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (doUserExists) {
            throw new Error("User already exists");
        }
        const userCreated = yield __1.prisma.user.createMany({ data: [{ email: email, password: (0, validation_1.hashingPassword)(password), roleType: role }] });
        if (userCreated.count >= 1) {
            return res.status(200).json({ error: false, message: "User created successfully" });
        }
        else {
            throw new Error("Cannot create user");
        }
    }
    catch (e) {
        return res.status(500).json({ error: true, message: e.message });
    }
});
const authController = new AuthController();
exports.authController = authController;
