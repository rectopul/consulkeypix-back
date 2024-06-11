import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InfosService } from './infos.service';
import { UpdateInfoDto } from './dto/update-info.dto';
import { Infos, Prisma } from '@prisma/client';

@Controller('infos')
export class InfosController {
  constructor(private readonly infosService: InfosService) {}

  @Post()
  async create(@Body() createInfoDto: { data: string }): Promise<Infos[]> {
    return this.infosService.create(createInfoDto);
  }

  @Get()
  async findAll(
    @Query('cursor') cursor,
    @Query('skip') skip,
    @Query('take') take,
    @Query('where') where,
    @Query('orderBy') orderBy,
  ): Promise<Infos[]> {
    return this.infosService.findAll({ cursor, skip, orderBy, take, where });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.infosService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: Prisma.InfosUpdateInput) {
    return this.infosService.update({ data, where: { id: +id } });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.infosService.remove(+id);
  }
}
