import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';

@Injectable()
export class EventosService {
  constructor(private prisma: PrismaService) {}

  async create(createEventoDto: CreateEventoDto) {
    return this.prisma.evento.create({
      data: {
        ...createEventoDto,
        data: new Date(createEventoDto.data),
      },
    });
  }

  async findAll() {
    return this.prisma.evento.findMany({
      include: {
        _count: {
          select: {
            ingressos: true,
          },
        },
      },
      orderBy: {
        data: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const evento = await this.prisma.evento.findUnique({
      where: { id },
      include: {
        ingressos: true,
        _count: {
          select: {
            ingressos: true,
          },
        },
      },
    });

    if (!evento) {
      throw new NotFoundException(`Evento com ID ${id} não encontrado`);
    }

    return evento;
  }

  async update(id: string, updateEventoDto: UpdateEventoDto) {
    await this.findOne(id); // Verifica se existe

    const updateData: any = { ...updateEventoDto };
    if (updateEventoDto.data) {
      updateData.data = new Date(updateEventoDto.data);
    }

    return this.prisma.evento.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Verifica se existe

    return this.prisma.evento.delete({
      where: { id },
    });
  }

  async getIngressosDisponiveis(id: string) {
    const evento = await this.findOne(id);
    
    const ingressosVendidos = await this.prisma.ingresso.count({
      where: {
        eventoId: id,
        status: 'ativo',
      },
    });

    return {
      eventoId: id,
      ingressosDisponiveis: evento.ingressosTotal - ingressosVendidos,
      ingressosTotal: evento.ingressosTotal,
      ingressosVendidos,
      preco: evento.preco,
      linkPagamento: evento.linkPagamento,
    };
  }

  async updateIngressosDisponiveis(id: string, quantidade: number) {
    return this.prisma.evento.update({
      where: { id },
      data: {
        ingressosDisponiveis: quantidade,
      },
    });
  }
}

