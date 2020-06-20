import fs from "fs";
import request from "request";

interface IdownloadImage {
    name: string;
    link: string;
    folder: string;
}
interface Ireq {
    err: any;
    res: any;
    body: any;
}
const downloadImage = async (props: IdownloadImage) => {
    const { link, folder, name } = props;
    await request.head(link, (err: any, res: any) => {
        if (err) return err;
        else {
            console.log("content-type:", res.headers["content-type"]);
            console.log("content-length:", res.headers["content-length"]);
            request(link).pipe(fs.createWriteStream(folder + "/" + name)).on("close", (err: any, res: any) => {
                if (err) console.log(err);
                else console.log(res);
                return res;
            });
        }
    });
}; 

export default downloadImage;
