

import client from "twilio";
import { MESSAGE_AUTH,MESSAGE_SID,MESSAGE_NUMBER } from "../util/secrets";
const accountSid = MESSAGE_SID;
const authToken = MESSAGE_AUTH;
const messageClient = client(accountSid, authToken);
interface SendMessageProps {
    code: number;
    userNumber: string;
}

const sendMessage = (props: SendMessageProps) => {
    const { code, userNumber } = props;
    messageClient.messages.create({
        body: `<#> ${code} is your Apna App code`,
        from: MESSAGE_NUMBER,
        to: `${userNumber.includes("+91") ? userNumber : `+91${userNumber}`}`
    })
        .then(message => console.log("LETTT", message.sid)).catch(e => {
            console.log("ERROR", e);
        });
};

const sendWhatsAppMessage = (props: SendMessageProps) => {
    const { code, userNumber } = props;
    messageClient.messages.create({
        from: `whatsapp:${MESSAGE_NUMBER}`,
        body: `${code} is your Apna App code`,
        to: `whatsapp:${userNumber.includes("+91") ? userNumber : `+91${userNumber}`}`
    })
        .then(message => console.log("LETTT", message.sid)).catch(e => {
            console.log("ERROR", e);
        });
};
export default { sendMessage, sendWhatsAppMessage };
