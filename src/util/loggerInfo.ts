import logger from "./logger";

export const infoLog = (functionName: string,params: object) =>{
    
    logger.info({
    level:"info",
    message:{...params,message:`${new Date().toISOString()} from function :- ${functionName} `}
});

}; 

export const errorLog = (functionName: string,params: object,method: any)=>{
    logger.error(`${new Date().toISOString()} ${params} ${method}`);
};