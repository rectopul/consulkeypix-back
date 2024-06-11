import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { PixToken, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TokensService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.PixTokenCreateInput): Promise<PixToken> {
    try {
      const hasToken = await this.prisma.pixToken.findUnique({
        where: { ...data },
      });

      if (hasToken) {
        throw new HttpException(`token já existe`, HttpStatus.CONFLICT);
      }

      const token = await this.prisma.pixToken.create({ data });

      return token;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('Erro ao criar token', HttpStatus.BAD_REQUEST);
      }
    }
  }

  findAll() {
    return `This action returns all tokens`;
  }

  findOne(id: number) {
    return `This action returns a #${id} token`;
  }

  async update(
    id: number,
    data: Prisma.PixTokenUpdateInput,
  ): Promise<PixToken> {
    try {
      const token = await this.prisma.pixToken.update({ where: { id }, data });

      return token;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('Erro ao criar token', HttpStatus.BAD_REQUEST);
      }
    }
  }

  remove(id: number) {
    return `This action removes a #${id} token`;
  }
}
