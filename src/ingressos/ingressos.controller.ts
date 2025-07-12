import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { IngressosService } from './ingressos.service';
import { CreateIngressoDto } from './dto/create-ingresso.dto';
import { ConsultarIngressoDto } from './dto/consultar-ingresso.dto';

@Controller('ingressos')
export class IngressosController {
  constructor(private readonly ingressosService: IngressosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createIngressoDto: CreateIngressoDto) {
    const ingresso = await this.ingressosService.create(createIngressoDto);
    return {
      sucesso: true,
      mensagem: 'Ingresso criado com sucesso',
      data: ingresso,
    };
  }

  @Post('consultar')
  async consultar(@Body() consultarIngressoDto: ConsultarIngressoDto) {
    try {
      const ingressos =
        await this.ingressosService.consultar(consultarIngressoDto);
      return {
        sucesso: true,
        mensagem: 'Ingresso encontrado',
        data: ingressos[0], // Retorna o primeiro ingresso encontrado
        hash: ingressos[0].hash,
      };
    } catch (error) {
      return {
        sucesso: false,
        mensagem: error.message,
        data: null,
      };
    }
  }

  @Get()
  async findAll() {
    const ingressos = await this.ingressosService.findAll();
    return {
      sucesso: true,
      data: ingressos,
    };
  }

  @Get('estatisticas')
  async getEstatisticas() {
    const estatisticas = await this.ingressosService.getEstatisticas();
    return {
      sucesso: true,
      data: estatisticas,
    };
  }

  @Get('hash/:hash')
  async findByHash(@Param('hash') hash: string) {
    const ingresso = await this.ingressosService.findByHash(hash);
    return {
      sucesso: true,
      data: ingresso,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const ingresso = await this.ingressosService.findOne(id);
    return {
      sucesso: true,
      data: ingresso,
    };
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    const ingresso = await this.ingressosService.updateStatus(id, status);
    return {
      sucesso: true,
      mensagem: 'Status do ingresso atualizado com sucesso',
      data: ingresso,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.ingressosService.remove(id);
    return {
      sucesso: true,
      mensagem: 'Ingresso removido com sucesso',
    };
  }
}
