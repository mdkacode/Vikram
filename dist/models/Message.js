"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const MessageSchema = new mongoose_1.Schema({
    phoneNumber: { type: String, required: true, unique: true },
    code: { type: String, required: true },
    status: { type: Boolean, required: true },
});
// // Export the model and return your IUser interface
// export default mongoose.model<MessageProps>("Message", MessageSchema);
exports.Message = mongoose_1.default.model("Message", MessageSchema);
//# sourceMappingURL=Message.js.map