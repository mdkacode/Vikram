import TelegramBot from "node-telegram-bot-api";

const token = "1837187132:AAFK8JOUTU13SfxSLrLW8wIG3ozuQSz9J60";

const bot = new TelegramBot(token, { polling: false });

const sendTeleegramNotification = (
  id: string = "447233341",
  message: string
) => {
  console.log("qwertyuiuytrewqwertyuioiuytrewertyuiuytrewertyui");
  bot.sendMessage(id, message);
};

export default sendTeleegramNotification;
