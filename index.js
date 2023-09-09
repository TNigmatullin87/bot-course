const TelegramApi = require('node-telegram-bot-api');

const {gameOptions, againOptions}  = require('options')

const token = '6440169982:AAF9RuXb94J4F9m6aa2wpZj3rgqvJLcAQPM';

const bot = new TelegramApi(token, {polling: true});

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9 а ты должен ее отгадать')
    const randomNumber = Math.floor(Math.random()*10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId,'Отгадывай', gameOptions);
}
const start = () => {

    bot.setMyCommands( [
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'Игра угадай цифру'}
    ]);

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/c36/1c0/c361c044-f105-45f1-ba01-33626dfc1d57/256/39.webp')
            return bot.sendMessage(chatId, "Добро пожаловать на мой Телеграмм-Канал");
        }
        if (text === '/info') {
            return await bot.sendMessage(chatId, `Тебя зовут ${msg.chat.first_name}`);
        }

        if (text ==='/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю');
    })
    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        console.log(msg);
        console.info(chats[chatId]);
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data === String(chats[chatId])) {
            return bot.sendMessage(chatId, `Ты угадал! Цифра ${data}`, againOptions);
        } else {
            return bot.sendMessage(chatId, `Ты не угадал, бот загадал цифру ${chats[chatId]}, а ты нажал ${data}`, againOptions);
        }
    })
}

start();

