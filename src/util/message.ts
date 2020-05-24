

import client from "twilio";
const accountSid = "AC1adf40fa2851736e7fa7ff1f8911edff";
const authToken = "023106d65a4c571b38540bff5c509573";
const messageClient = client(accountSid, authToken);
interface SendMessageProps {
    code: number;
    userNumber: string;
}

const sendMessage = (props: SendMessageProps) => {
    const { code, userNumber } = props;
    messageClient.messages.create({
        body: `<#> ${code} is your Mangao code`,
        from: "+17632963461",
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
        body: `${code} is your Mangao code`,
        to: `whatsapp:${userNumber.includes("+91") ? userNumber : `+91${userNumber}`}`
    })
        .then(message => console.log("LETTT", message.sid)).catch(e => {
            console.log("ERROR", e);
        });
};
export default { sendMessage, sendWhatsAppMessage };
