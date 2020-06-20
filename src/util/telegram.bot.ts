import TelegramBot from "node-telegram-bot-api";

const token = "1175820596:AAFVkht4TXOiQOE0aiRbII4iU4DmnYYBjBM";

const bot = new TelegramBot(token, { polling: false });


const sendTeleegramNotification = (id: string = "447233341", message: string) => {

    console.log("qwertyuiuytrewqwertyuioiuytrewertyuiuytrewertyui");
    bot.sendMessage(id, message);

};


export default sendTeleegramNotification;
