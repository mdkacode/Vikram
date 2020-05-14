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
const CategorySchema = new mongoose_1.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    createdBy: { type: String, required: true, unique: false },
    updatedBy: { type: String, required: true, unique: false },
    imagepath: { type: String, required: false, unique: false },
    imageList: { type: Object, required: false, unique: false },
    createdOn: { type: String, required: false, unique: false }
});
exports.MasterCategory = mongoose_1.default.model("MasterCategory", CategorySchema);
//# sourceMappingURL=Category.js.map