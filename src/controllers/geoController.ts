import { Request, Response } from "express";
import GEO from "../util/geoRest";
export const areaSuggestion = async (req: Request = null, res: Response = null) => {

    const getQ: object = req.query as object;
    const response = await GEO.autoSuggest(getQ);
    if (response) {
        res.status(200).jsonp(response);
    }
    else {
        res.status(500).jsonp({ message: "somethong went wrong" });
    }

};

// get area name from lat long
export const reverseGeoCode = async (req: Request = null, res: Response = null) => {

    const getQ: object = req.query as object;
    const response = await GEO.reverseGeoCode(getQ);
    if (response) {
        res.status(200).jsonp(response);
    }
    else {
        res.status(500).jsonp({ message: "somethong went wrong" });
    }

};