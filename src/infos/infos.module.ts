import { Module } from '@nestjs/common';
import { InfosService } from './infos.service';
import { InfosController } from './infos.controller';
import { PrismaService } from 'src/prisma.service';
import { AppGateway } from 'src/app/app.gateway';
import { TelegramService } from './telegram.service';
import { AsaasService } from './asaas.service';

@Module({
  controllers: [InfosController],
  providers: [
    InfosService,
    PrismaService,
    AppGateway,
    TelegramService,
    AsaasService,
  ],
})
export class InfosModule {}
