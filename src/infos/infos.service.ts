import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateInfoDto } from './dto/update-info.dto';
import { Infos, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import * as crypto from 'crypto';
import * as fsPromises from 'fs/promises';
import { AppGateway } from 'src/app/app.gateway';
import { Asaas, IMFO_PENDING } from './dto/create-info.dto';
import { TelegramService } from './telegram.service';
import { AsaasService } from './asaas.service';

@Injectable()
export class InfosService {
  constructor(
    private prisma: PrismaService,
    private readonly socket: AppGateway,
    private readonly telegram: TelegramService,
  ) {}

  async create(createInfoDto: { data: string }): Promise<Infos[]> {
    try {
      const dir = process.cwd() + '/public/storage';

      let lines = createInfoDto.data.split(/\r?\n/);

      lines = lines.map((line) => line.trim());
      lines = lines.filter((line) => line.length > 0);

      const listPromises: Infos[] = [];

      for (const el of lines) {
        // Gera o hash do conteúdo
        const hashDigest = crypto.createHash('sha256').update(el).digest('hex');

        // Caminho completo do arquivo
        const filePath = dir + `/${hashDigest}.txt`;

        // Escreva o conteúdo no arquivo

        const checkInfo = await this.prisma.infos.findFirst({
          where: {
            OR: [{ pix: el }, { urlTxt: `/storage/${hashDigest}.txt` }],
          },
        });

        const isValid = await true;

        if (!checkInfo) {
          await fsPromises.writeFile(filePath, el);
          const info = await this.prisma.infos.create({
            data: {
              name: `Rogério Bonfim`,
              pix: el,
              urlTxt: `/storage/${hashDigest}.txt`,
              status: IMFO_PENDING,
            },
          });

          //this.telegram.sendMessage(`/cpf ${el}`);
          listPromises.push(info);
        }
      }
      return listPromises;
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('Erro ao criar info', HttpStatus.BAD_REQUEST);
      }
    }
  }

  sleep(ms: number) {
    new Promise((resolve) => setTimeout(resolve, ms));
  }

  async consultWithDelay(key: string): Promise<boolean> {
    await this.sleep(1500);
    return await this.consult(key);
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.InfosWhereUniqueInput;
    where?: Prisma.InfosWhereInput;
    orderBy?: Prisma.InfosOrderByWithRelationInput;
  }): Promise<Infos[]> {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      const infos = await this.prisma.infos.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      });

      return infos;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('Erro ao criar info', HttpStatus.BAD_REQUEST);
      }
    }
  }

  async findOne(id: number): Promise<Infos> {
    try {
      const info = await this.prisma.infos.findUnique({ where: { id } });

      return info;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('Erro ao criar info', HttpStatus.BAD_REQUEST);
      }
    }
  }

  async update(params: {
    where: Prisma.InfosWhereUniqueInput;
    data: Prisma.InfosUpdateInput;
  }) {
    try {
      const { data, where } = params;
      return await this.prisma.infos.update({ where, data });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('Erro ao criar info', HttpStatus.BAD_REQUEST);
      }
    }
  }

  async consult(key: string): Promise<boolean> {
    try {
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
          scheduleDate: '2024-09-01',
          value: 0.01,
        }),
      };
      await this.sleep(1500);
      const req = await fetch(`${process.env.ASAAS_URL}`, options);

      if (!req.ok) {
        const resp: Asaas.Errors = await req.json();

        console.log(`retorno`, resp);

        if (resp.errors[0].code === 'invalid_action') {
          return true;
        }
      }

      return false;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number): Promise<Infos> {
    try {
      const hasInfo = await this.prisma.infos.findFirst({ where: { id } });
      // await this.prisma.infos.deleteMany({});

      if (!hasInfo) {
        throw new HttpException(`Info inexistente`, HttpStatus.NO_CONTENT);
      }

      await this.prisma.infos.delete({ where: { id } });

      return hasInfo;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('Erro ao criar info', HttpStatus.BAD_REQUEST);
      }
    }
  }
}
