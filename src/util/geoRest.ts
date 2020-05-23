import Axios from "axios";
export interface IautoSuggestProps {
    apiKey?: string;
    query: string; // search area Name
    country?: string;
    prox?: string; // lat+long,AREA(meters) eg- 11.23,23.23,2000   
    maxresults?: string;
    resultType?: string;

}
export interface IreverseGeoCodeProps {
    at: string; // cordinates
    lang: string;
    apiKey: string;
}
export interface IgeoCodeProps {
    at: string; // cordinates
    lang: string;
    apiKey: string;
}

/** 
   * Shopping,
       ** Food and Drink,Drugstore or Pharmacy,Hardware, House and Garden,Bookstore
   */
const reverseGeoCodeUri = "https://revgeocode.search.hereapi.com/v1/revgeocode";
const geoCodeApi = "https://geocode.search.hereapi.com/v1/geocode";
const api = "https://browse.search.hereapi.com/v1/browse";

const autoSuggest = async (props: IautoSuggestProps) => {


    props.apiKey = process.env.MAP_API;
    console.log({ ...props });
    const autoComplete = await Axios(
        {
            method: "GET",
            url: api,
            params: { ...props }
        }

    );
    console.log(autoComplete.data.items);
    return autoComplete.data.items;
};

const geoCode = async (props: IgeoCodeProps) => {


    props.apiKey = process.env.MAP_API;
    console.log({ ...props });
    const autoComplete = await Axios(
        {
            method: "GET",
            url: geoCodeApi,
            params: { ...props }
        }

    );
    console.log(autoComplete.data.items);
    return autoComplete.data.items;
};

const reverseGeoCode = async (props: IreverseGeoCodeProps) => {

    props.apiKey = process.env.MAP_API;
    props.lang = "en-US";
    const autoComplete = await Axios(
        {
            method: "GET",
            url: reverseGeoCodeUri,
            params: { ...props }
        }
    );
    console.log(autoComplete.data.items);
    return autoComplete.data.items;
};
export default { autoSuggest, reverseGeoCode, geoCode };


// //apiKey:1E4jvkyA1hk3uvH4cOlrbYq7GK8xA9CRN0j8JxeS5xU
// query:Sufip // searched query
// country:IND // Searched Country
// prox:27.1592,78.3957,2000
// maxresults:20 // result to fetch
// //resultType:areas // type of location