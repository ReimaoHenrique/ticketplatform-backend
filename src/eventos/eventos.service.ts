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

    return this.prisma.evento.update({
      where: { id },
      data: {
        ...updateEventoDto,
        ...(updateEventoDto.data && { data: new Date(updateEventoDto.data) }),
      },
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

  async getConvidados(id: string) {
    // Verifica se o evento existe
    await this.findOne(id);

    const convidados = await this.prisma.ingresso.findMany({
      where: {
        eventoId: id,
        status: 'ativo',
      },
      select: {
        id: true,
        cpf: true,
        nome: true,
        email: true,
        hash: true,
        dataCompra: true,
        status: true,
        createdAt: true,
      },
      orderBy: {
        dataCompra: 'desc',
      },
    });

    return convidados;
  }

  async consultarConvidado(
    id: string,
    consultarDto: { cpf: string; nome: string },
  ) {
    // Verifica se o evento existe
    await this.findOne(id);

    const convidado = await this.prisma.ingresso.findFirst({
      where: {
        eventoId: id,
        cpf: consultarDto.cpf,
        nome: consultarDto.nome,
        status: 'ativo',
      },
      include: {
        evento: {
          select: {
            nome: true,
            data: true,
            local: true,
          },
        },
      },
    });

    if (!convidado) {
      throw new Error('Nenhum convidado encontrado com os dados informados');
    }

    return convidado;
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
