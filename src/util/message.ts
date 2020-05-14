

import client from "twilio";
const accountSid = "AC1adf40fa2851736e7fa7ff1f8911edff";
const authToken = "6450256ca923b6c5ecece556bf4cb3c9";
const messageClient = client(accountSid, authToken);
interface SendMessageProps {
    code: number;
    userNumber: string;
}

const sendMessage = (props: SendMessageProps) =>{
    const { code,userNumber} = props;
    messageClient.messages.create({
        body: `Your Code is ${code} for Login.`,
        from: "+17632963461",
        to: `${userNumber.includes("+91") ?  userNumber :`+91${userNumber}`}`
    })
        .then(message => console.log(message.sid));
};
export default sendMessage;
