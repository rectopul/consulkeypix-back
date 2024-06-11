import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { addDays, format } from 'date-fns';
import {
  Asaas,
  IMFO_PENDING,
  IMFO_VALID,
  IMFO_LIMIT,
} from './dto/create-info.dto';
import { AppGateway } from 'src/app/app.gateway';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AsaasService {
  private readonly logger = new Logger(AsaasService.name);

  constructor(
    private readonly socket: AppGateway,
    private readonly prisma: PrismaService,
  ) {}

  @Cron('*/4 * * * * *') // Agendamento a cada 2 segundos
  async job(): Promise<void> {
    try {
      const info = await this.prisma.infos.findMany({
        where: {
          OR: [{ status: IMFO_PENDING }, { status: IMFO_LIMIT }],
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      });

      if (info.length > 0) {
        await this.consult(info[0].pix);

        await this.socket.handleMessage('', info);
      }
    } catch (error) {
      console.log(error);
      throw new Error('Erro ao criar info');
    }
  }

  async consult(key: string): Promise<boolean> {
    try {
      // Gerar um número aleatório entre 1 e 30 para adicionar aos dias
      const randomDays = Math.floor(Math.random() * 30) + 1;

      // Adicionar os dias aleatórios à data atual para obter a data futura
      const futureDate = addDays(new Date(), randomDays);

      // Formatar a data no formato desejado
      const formattedDate = format(futureDate, 'yyyy-MM-dd');

      const value = (Math.floor(Math.random() * 10) + 1) / 100;
      const options: RequestInit = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          access_token: process.env.ASAAS_API_KEY,
        },
        body: JSON.stringify({
          operationType: 'PIX',
          pixAddressKeyType: 'CPF',
          pixAddressKey: key,
          scheduleDate: formattedDate,
          value: value,
        }),
      };
      const req = await fetch(`${process.env.ASAAS_URL}`, options);

      if (!req.ok) {
        const resp: Asaas.Errors = await req.json();

        this.logger.debug(resp.errors[0].description);

        if (resp.errors[0].code === 'invalid_action') {
          if (resp.errors[0].description.includes('Limite')) {
            await this.prisma.infos.update({
              where: { pix: key },
              data: { status: IMFO_LIMIT },
            });
            return false;
          } else {
            await this.prisma.infos.update({
              where: { pix: key },
              data: { status: IMFO_VALID },
            });
            return true;
          }
        }
      }

      return false;
    } catch (error) {
      throw error;
    }
  }
}
