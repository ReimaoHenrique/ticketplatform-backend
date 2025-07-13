import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
  ParseIntPipe,
} from '@nestjs/common';
import { EventosService } from './eventos.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { CreateConvidadoDto } from './dto/create-convidado.dto';
import { ConsultarStatusDto } from './dto/consultar-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UpdateStatusByIdDto } from './dto/update-status-by-id.dto';
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
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const evento = await this.eventosService.findOne(id);
    return {
      sucesso: true,
      data: evento,
    };
  }

  @Get(':id/ingressos/disponiveis')
  async getIngressosDisponiveis(@Param('id', ParseIntPipe) id: number) {
    const data = await this.eventosService.getIngressosDisponiveis(id);
    return {
      sucesso: true,
      data,
    };
  }

  @Get(':id/convidados')
  async getConvidados(@Param('id', ParseIntPipe) id: number) {
    const convidados = await this.eventosService.getConvidados(id);
    return {
      sucesso: true,
      data: convidados,
    };
  }

  @Post(':id/convidados/consultar')
  async consultarConvidado(
    @Param('id', ParseIntPipe) id: number,
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
      };
    } catch (error) {
      return {
        sucesso: false,
        mensagem: (error as Error).message,
        data: null,
      };
    }
  }

  @Post('convidados')
  @HttpCode(HttpStatus.CREATED)
  async createConvidado(@Body() createConvidadoDto: CreateConvidadoDto) {
    try {
      const convidado =
        await this.eventosService.createConvidado(createConvidadoDto);
      return {
        sucesso: true,
        mensagem: 'Convidado criado com sucesso',
        data: convidado,
      };
    } catch (error) {
      return {
        sucesso: false,
        mensagem: (error as Error).message,
        data: null,
      };
    }
  }

  @Post('convidados/status')
  async consultarStatus(@Body() consultarStatusDto: ConsultarStatusDto) {
    try {
      const resultado =
        await this.eventosService.consultarStatus(consultarStatusDto);
      return {
        sucesso: true,
        mensagem: 'Status consultado com sucesso',
        data: resultado,
      };
    } catch (error) {
      return {
        sucesso: false,
        mensagem: (error as Error).message,
        data: null,
      };
    }
  }

  @Patch('convidados/status')
  @UseGuards(AdminGuard)
  async updateStatus(@Body() updateStatusDto: UpdateStatusDto) {
    try {
      const resultado = await this.eventosService.updateStatus(updateStatusDto);
      return {
        sucesso: true,
        mensagem: 'Status atualizado com sucesso',
        data: resultado,
      };
    } catch (error) {
      return {
        sucesso: false,
        mensagem: (error as Error).message,
        data: null,
      };
    }
  }

  @Put('convidados/status')
  @UseGuards(AdminGuard)
  async updateStatusPut(@Body() updateStatusDto: UpdateStatusDto) {
    try {
      const resultado = await this.eventosService.updateStatus(updateStatusDto);
      return {
        sucesso: true,
        mensagem: 'Status atualizado com sucesso',
        data: resultado,
      };
    } catch (error) {
      return {
        sucesso: false,
        mensagem: (error as Error).message,
        data: null,
      };
    }
  }

  @Put('convidados/status/id')
  @UseGuards(AdminGuard)
  async updateStatusById(@Body() updateStatusByIdDto: UpdateStatusByIdDto) {
    try {
      const resultado =
        await this.eventosService.updateStatusById(updateStatusByIdDto);
      return {
        sucesso: true,
        mensagem: 'Status atualizado com sucesso',
        data: resultado,
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
    @Param('id', ParseIntPipe) id: number,
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
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.eventosService.remove(id);
    return {
      sucesso: true,
      mensagem: 'Evento removido com sucesso',
    };
  }
}
