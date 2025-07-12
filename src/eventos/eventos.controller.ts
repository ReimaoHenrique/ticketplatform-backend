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
import { AdminGuard } from '../admin/admin.guard';

@Controller('eventos')
export class EventosController {
  constructor(private readonly eventosService: EventosService) {}

  @Post()
  @UseGuards(AdminGuard)
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

  @Get(':id/convidados')
  async getConvidados(@Param('id') id: string) {
    const convidados = await this.eventosService.getConvidados(id);
    return {
      sucesso: true,
      data: convidados,
    };
  }

  @Post(':id/convidados/consultar')
  async consultarConvidado(
    @Param('id') id: string,
    @Body() consultarDto: { cpf: string; nome: string },
  ) {
    try {
      const convidado = await this.eventosService.consultarConvidado(
        id,
        consultarDto,
      );
      return {
        sucesso: true,
        mensagem: 'Convidado encontrado',
        data: convidado,
        hash: convidado.hash,
      };
    } catch (error) {
      return {
        sucesso: false,
        mensagem: (error as Error).message,
        data: null,
      };
    }
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  async update(
    @Param('id') id: string,
    @Body() updateEventoDto: UpdateEventoDto,
  ) {
    const evento = await this.eventosService.update(id, updateEventoDto);
    return {
      sucesso: true,
      mensagem: 'Evento atualizado com sucesso',
      data: evento,
    };
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.eventosService.remove(id);
    return {
      sucesso: true,
      mensagem: 'Evento removido com sucesso',
    };
  }
}
