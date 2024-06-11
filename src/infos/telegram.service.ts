import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';

@Injectable()
export class TelegramService {
  private bot: TelegramBot;

  constructor() {
    this.bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

    // Configurar para capturar respostas
    this.bot.command('chatid', (ctx) => {
      const chatId = ctx.chat.id;
      //const chatId = msg.chat.id;
      const text = ctx.text;
      console.log(`Received message: ${text} from chatId: ${chatId}`);

      // Aqui você pode processar a resposta conforme necessário
    });
  }

  async sendMessage(message: string): Promise<TelegramBot.Message> {
    try {
      this.bot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID, message);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}
