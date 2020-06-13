

import client from "twilio";
const accountSid = "AC414d4c5d23315ead1e3461c979a08603";
const authToken = "cfa3f40b276469b42cb49ae20ecaa57e";
const messageClient = client(accountSid, authToken);
interface SendMessageProps {
    code: number;
    userNumber: string;
}

const sendMessage = (props: SendMessageProps) => {
    const { code, userNumber } = props;
    messageClient.messages.create({
        body: `<#> ${code} is your Apna App code`,
        from: "+17867867719",
        to: `${userNumber.includes("+91") ? userNumber : `+91${userNumber}`}`
    })
        .then(message => console.log("LETTT", message.sid)).catch(e => {
            console.log("ERROR", e);
        });
};

const sendWhatsAppMessage = (props: SendMessageProps) => {
    const { code, userNumber } = props;
    messageClient.messages.create({
        from: "whatsapp:+17632963461",
        body: `${code} is your Apna App code`,
        to: `whatsapp:${userNumber.includes("+91") ? userNumber : `+91${userNumber}`}`
    })
        .then(message => console.log("LETTT", message.sid)).catch(e => {
            console.log("ERROR", e);
        });
};
export default { sendMessage, sendWhatsAppMessage };
