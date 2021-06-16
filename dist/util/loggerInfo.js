"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorLog = exports.infoLog = void 0;
const logger_1 = __importDefault(require("./logger"));
exports.infoLog = (functionName, params) => {
    logger_1.default.info({
        level: "info",
        message: Object.assign(Object.assign({}, params), { message: `${new Date().toISOString()} from function :- ${functionName} ` })
    });
};
exports.errorLog = (functionName, params, method) => {
    logger_1.default.error(`${new Date().toISOString()} ${params} ${method}`);
};
//# sourceMappingURL=loggerInfo.js.map