import fs from "fs";
import { IMAGE_URI, SERVER_IP, NOT_FOUND_IMAGE } from "./secrets";
import { infoLog } from "./loggerInfo";
export const imageUrls = (doc: any) => {
    let imageSource: string[] = []; // Pushing Image to it
    for (const t in doc) {
        if (doc[t]._id) {
            // infoLog("getProduct => IMAGE FOUND", [req.body, req.query]);
            if (fs.existsSync(IMAGE_URI + doc[t]._id)) {
                console.log(`image FOUND ${IMAGE_URI + doc[t]._id}`);
                fs.readdirSync(IMAGE_URI + doc[t]._id).forEach(file => {
                    imageSource.push(`http://52.186.14.151/api/static/${doc[t]._id + "/" + file}`);
                });
            }
            else {
                imageSource.push(NOT_FOUND_IMAGE);
            }
        }
        doc[t].imageList = imageSource;
        imageSource = [];
    }
};