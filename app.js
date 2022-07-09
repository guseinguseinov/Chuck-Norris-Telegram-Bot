import TelegramBot from 'node-telegram-bot-api';
import { getData } from './data.js';
import dotenv from 'dotenv';

let randomJoke;
let userChoice;
let category;

dotenv.config();
const token = process.env.TELEGRAM_TOKEN || 'Your Telegram Token';
const bot = new TelegramBot(token, {polling: true});
const helpText = 
`Type /randomjoke for a random joke
Type /joke for more jokes
`


bot.onText(/\/start/, (msg) => {
  let chatId = msg.chat.id;
  bot.sendMessage(chatId, 
    `Welcome, ${msg.chat.username}\nType /help to get more information.`);
});


bot.onText(/\/help/, (msg) => {
  let chatId = msg.chat.id;
  bot.sendMessage(chatId, helpText);
});


bot.onText(/\/randomjoke/, async (msg) => {
  let chatId = msg.chat.id; 
  randomJoke = await getData('https://api.chucknorris.io/jokes/random');
  randomJoke = randomJoke.data.value;

  bot.sendMessage(chatId, randomJoke);
});


bot.onText(/\/joke/, async (msg) => {
  let chatId = msg.chat.id;
  userChoice = await getData('https://api.chucknorris.io/jokes/categories');
  let arr = [];
  for (let elem of userChoice.data){
    arr.push([{text: elem, callback_data: elem}]);
  }

  bot.sendMessage(chatId, 'Choose one of the categories', {
    reply_markup: {
      one_time_keyboard: true,
      inline_keyboard: arr,
    }
  });
});


bot.on('callback_query',async (cbQuery) => {
  let keyboard = {reply_markup: {inline_keyboard: [[{text: '', callback_data: ''}]]}};
  let msg = cbQuery.message;
  category = cbQuery.data;
  
  let data = await getData(`https://api.chucknorris.io/jokes/random?category=${category}`)
  data = data.data.value;
  bot.answerCallbackQuery(cbQuery.id)
  .then(() => {
    bot.sendMessage(msg.chat.id, data);
    bot.editMessageReplyMarkup(keyboard, {
      chat_id: msg.chat.id,
      message_id: msg.message_id,
    });
  });
});