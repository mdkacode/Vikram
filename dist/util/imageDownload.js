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
const fs_1 = __importDefault(require("fs"));
const request_1 = __importDefault(require("request"));
const downloadImage = (props) => __awaiter(void 0, void 0, void 0, function* () {
    const { link, folder, name } = props;
    yield request_1.default.head(link, (err, res) => {
        if (err)
            return err;
        else {
            console.log("content-type:", res.headers["content-type"]);
            console.log("content-length:", res.headers["content-length"]);
            request_1.default(link).pipe(fs_1.default.createWriteStream(folder + "/" + name)).on("close", (err, res) => {
                if (err)
                    console.log(err);
                else
                    console.log(res);
                return res;
            });
        }
    });
});
exports.default = downloadImage;
//# sourceMappingURL=imageDownload.js.map