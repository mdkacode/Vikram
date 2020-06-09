"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const twilio_1 = __importDefault(require("twilio"));
const accountSid = "AC1adf40fa2851736e7fa7ff1f8911edff";
const authToken = "023106d65a4c571b38540bff5c509573";
const messageClient = twilio_1.default(accountSid, authToken);
const sendMessage = (props) => {
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
const sendWhatsAppMessage = (props) => {
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
exports.default = { sendMessage, sendWhatsAppMessage };
//# sourceMappingURL=message.js.map