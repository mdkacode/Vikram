"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const twilio_1 = __importDefault(require("twilio"));
const secrets_1 = require("../util/secrets");
const accountSid = secrets_1.MESSAGE_SID;
const authToken = secrets_1.MESSAGE_AUTH;
const messageClient = twilio_1.default(accountSid, authToken);
const sendMessage = (props) => {
    const { code, userNumber } = props;
    messageClient.messages.create({
        body: `<#> ${code} is your Apna App code`,
        from: secrets_1.MESSAGE_NUMBER,
        to: `${userNumber.includes("+91") ? userNumber : `+91${userNumber}`}`
    })
        .then(message => console.log("LETTT", message.sid)).catch(e => {
        console.log("ERROR", e);
    });
};
const sendWhatsAppMessage = (props) => {
    const { code, userNumber } = props;
    messageClient.messages.create({
        from: `whatsapp:${secrets_1.MESSAGE_NUMBER}`,
        body: `${code} is your Apna App code`,
        to: `whatsapp:${userNumber.includes("+91") ? userNumber : `+91${userNumber}`}`
    })
        .then(message => console.log("LETTT", message.sid)).catch(e => {
        console.log("ERROR", e);
    });
};
exports.default = { sendMessage, sendWhatsAppMessage };
//# sourceMappingURL=message.js.map