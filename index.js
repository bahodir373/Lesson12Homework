const TelegramBot = require('node-telegram-bot-api')
const MurojaatModel = require('./models/MurojaatModel')
const dbConnect = require('./db/dbConnect')
require('dotenv').config()	
const token = process.env.TOKEN
const bot = new TelegramBot(token, {polling: true})

dbConnect()

bot.setMyCommands([
  { command: '/start', description: 'Start the bot' },
  { command: '/get_message_of_today', description: 'Bugungi xabarlarni olish' },
  { command: '/get_last_ten_days_messages', description: 'On kunlik xabarlar' },
]);

function runBot() {
	bot.on('message', async (msg) => {
		const chatID = msg.chat.id
		const text = msg.text

		if (text === '/start') {
			bot.sendMessage(chatID, `Salom, ${msg.from.first_name}! Bu yerga murojaatingizni yozishingiz mumkin.`)
		} else if (text === '/help') {
			bot.sendMessage(chatID, `Help commands`)
		} else if(text == '/get_message_of_today'){
			const today = new Date()
			const start = new Date(today.getFullYear(), today.getMonth(), today.getDate())
			const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)


			const murojaat = await MurojaatModel.find({
				date: {
					$gte: start,
					$lt: end
				}
			})

			if(murojaat.length > 0){
				bot.sendMessage(chatID, `Bugungi murojaatlar:\n${murojaat.map((item, index) => `${index + 1}. ${item.murojaat}`).join('\n')}`)
			}else{
				bot.sendMessage(chatID, `Bugun murojaatlar yo'q`)
			}
		} else if (text == '/get_last_ten_days_messages') {
			const today = new Date();
			const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10);
			const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1); 
	
			const murojaatlar = await MurojaatModel.find({
					date: {
							$gte: start,
							$lt: end,
					},
			});
	
			if (murojaatlar.length > 0) {
					const formatDate = (date) => {
							return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
					};
	
					const message = murojaatlar
							.map((item, index) => `${index + 1}. ${item.murojaat} (${formatDate(new Date(item.date))})`)
							.join('\n');
	
					bot.sendMessage(chatID, `Oxirgi o'n kunlik murojaatlar:\n${message}`);
			} else {
					bot.sendMessage(chatID, `Oxirgi o'n kun ichida murojaatlar yo'q.`);
			}
	}
	
		 else{
			await MurojaatModel.create({
				chatID: chatID,
				full_name: msg.from.first_name,
				username: msg.from.username,
				murojaat: text
			})

			bot.sendMessage(chatID, `Sizning murojaatingiz qabul qilindi. Tez orada ko'rib chiqiladi.`)
		}
	})
		
}

runBot()