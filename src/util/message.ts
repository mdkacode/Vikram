// import client from "twilio";
// const accountSid = "AC1adf40fa2851736e7fa7ff1f8911edff";
// const authToken = "023106d65a4c571b38540bff5c509573";
// const messageClient = client(accountSid, authToken);
import Axios from "axios";
interface SendMessageProps {
  code: number;
  userNumber: string;
}

const sendMessage = async (props: SendMessageProps) => {
  const { code, userNumber } = props;
  //   messageClient.messages
  //     .create({
  //       body: `<#> ${code} is your Mangao code`,
  //       from: "+17632963461",
  //       to: `${userNumber.includes("+91") ? userNumber : `+91${userNumber}`}`,
  //     })
  //     .then((message) => console.log("LETTT", message.sid))
  //     .catch((e) => {
  //       console.log("ERROR", e);
  //     });
  const message = `${code} is your Mornigo Code`;
  const sendMessage = await Axios.get(
    `http://my.usacricket.org:7200?phone=${userNumber}&code=91&message=${message}`
  );
  console.log(sendMessage.data, "GETRES");
  return sendMessage;
};

// const sendWhatsAppMessage = (props: SendMessageProps) => {
//   const { code, userNumber } = props;
//   messageClient.messages
//     .create({
//       from: "whatsapp:+17632963461",
//       body: `${code} is your Mangao code`,
//       to: `whatsapp:${
//         userNumber.includes("+91") ? userNumber : `+91${userNumber}`
//       }`,
//     })
//     .then((message) => console.log("LETTT", message.sid))
//     .catch((e) => {
//       console.log("ERROR", e);
//     });
// };
export default { sendMessage };
