"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const twilio_1 = __importDefault(require("twilio"));
const accountSid = "AC1adf40fa2851736e7fa7ff1f8911edff";
const authToken = "6450256ca923b6c5ecece556bf4cb3c9";
const messageClient = twilio_1.default(accountSid, authToken);
const sendMessage = (props) => {
    const { code, userNumber } = props;
    messageClient.messages.create({
        body: `Your Code is ${code} for Login.`,
        from: "+17632963461",
        to: `${userNumber.includes("+91") ? userNumber : `+91${userNumber}`}`
    })
        .then(message => console.log(message.sid));
};
exports.default = sendMessage;
//# sourceMappingURL=message.js.map