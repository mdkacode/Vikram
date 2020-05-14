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
const ProductSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    productName: { type: String, required: true, unique: true },
    quantity: { type: Number, required: true },
    mPrice: { type: String, required: true },
    sPrice: { type: String, required: true },
    imagePath: { type: String, required: false },
    imageArray: { type: String, required: false },
    category: { type: String, required: true },
    sku: { type: Number, required: true },
});
// // Export the model and return your IUser interface
// export default mongoose.model<MessageProps>("Message", MessageSchema);
exports.Product = mongoose_1.default.model("Product", ProductSchema);
//# sourceMappingURL=Product.js.map