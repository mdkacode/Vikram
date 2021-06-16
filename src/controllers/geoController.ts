import { Request, Response } from "express";
import GEO from "../util/geoRest";
import {} from "lodash";
import { replaceAll } from "../util";
export const areaSuggestion = async (
  req: Request = null,
  res: Response = null
) => {
  const getQ: object = req.query as object;
  const responseArray: {
    title: string;
    address: string;
    geoCode: string;
  }[] = [];
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const response = await GEO.autoSuggest(getQ);
  if (response.length > 0) {
    response.map((res: Record<string, any>) => {
      responseArray.push({
        title: res.title,
        address: res.address.label,
        geoCode: res.position,
      });
    });
    res
      .status(200)
      .jsonp({ items: responseArray, length: responseArray.length });
  } else {
    res.status(500).jsonp({ message: "somethong went wrong" });
  }
};

// get area name from lat long
export const reverseGeoCode = async (
  req: Request = null,
  res: Response = null
) => {
  const getQ: object = req.query as object;
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const response = await GEO.reverseGeoCode(getQ);
  if (response) {
    res.status(200).jsonp(response);
  } else {
    res.status(500).jsonp({ message: "somethong went wrong" });
  }
};
export const geoCode = async (req: Request = null, res: Response = null) => {
  const getQ: object = req.query as object;
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const response = await GEO.geoCode(getQ);
  if (response) {
    res.status(200).jsonp(response);
  } else {
    res.status(500).jsonp({ message: "somethong went wrong" });
  }
};
