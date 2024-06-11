import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InfosModule } from './infos/infos.module';
import { AppGateway } from './app/app.gateway';
import { TokensModule } from './tokens/tokens.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [InfosModule, TokensModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
