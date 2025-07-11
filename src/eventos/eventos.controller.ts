import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { EventosService } from './eventos.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';

@Controller('eventos')
export class EventosController {
  constructor(private readonly eventosService: EventosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createEventoDto: CreateEventoDto) {
    const evento = await this.eventosService.create(createEventoDto);
    return {
      sucesso: true,
      mensagem: 'Evento criado com sucesso',
      data: evento,
    };
  }

  @Get()
  async findAll() {
    const eventos = await this.eventosService.findAll();
    return {
      sucesso: true,
      data: eventos,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const evento = await this.eventosService.findOne(id);
    return {
      sucesso: true,
      data: evento,
    };
  }

  @Get(':id/ingressos/disponiveis')
  async getIngressosDisponiveis(@Param('id') id: string) {
    const data = await this.eventosService.getIngressosDisponiveis(id);
    return {
      sucesso: true,
      data,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateEventoDto: UpdateEventoDto) {
    const evento = await this.eventosService.update(id, updateEventoDto);
    return {
      sucesso: true,
      mensagem: 'Evento atualizado com sucesso',
      data: evento,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.eventosService.remove(id);
    return {
      sucesso: true,
      mensagem: 'Evento removido com sucesso',
    };
  }
}

