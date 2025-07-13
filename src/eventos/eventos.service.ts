import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { CreateConvidadoDto } from './dto/create-convidado.dto';
import { ConsultarStatusDto } from './dto/consultar-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

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
            convidados: true,
          },
        },
      },
      orderBy: {
        data: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const evento = await this.prisma.evento.findUnique({
      where: { id },
      include: {
        convidados: true,
        _count: {
          select: {
            convidados: true,
          },
        },
      },
    });

    if (!evento) {
      throw new NotFoundException(`Evento com ID ${id} não encontrado`);
    }

    return evento;
  }

  async update(id: number, updateEventoDto: UpdateEventoDto) {
    await this.findOne(id); // Verifica se existe

    return this.prisma.evento.update({
      where: { id },
      data: {
        ...updateEventoDto,
        ...(updateEventoDto.data && { data: new Date(updateEventoDto.data) }),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Verifica se existe

    return this.prisma.evento.delete({
      where: { id },
    });
  }

  async getIngressosDisponiveis(id: number) {
    const evento = await this.findOne(id);

    const convidadosConfirmados = await this.prisma.convidado.count({
      where: {
        eventoId: id,
        status: 'confirmado',
      },
    });

    return {
      eventoId: id,
      ingressosDisponiveis: evento.ingressosTotal - convidadosConfirmados,
      ingressosTotal: evento.ingressosTotal,
      ingressosVendidos: convidadosConfirmados,
      preco: evento.preco,
      linkPagamento: evento.linkPagamento,
    };
  }

  async getConvidados(id: number) {
    // Verifica se o evento existe
    await this.findOne(id);

    const convidados = await this.prisma.convidado.findMany({
      where: {
        eventoId: id,
      },
      select: {
        id: true,
        cpf: true,
        nome: true,
        email: true,
        telefone: true,
        status: true,
        observacoes: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return convidados;
  }

  async consultarConvidado(
    id: number,
    consultarDto: { cpf: string; nome: string },
  ) {
    // Verifica se o evento existe
    await this.findOne(id);

    const convidado = await this.prisma.convidado.findFirst({
      where: {
        eventoId: id,
        cpf: consultarDto.cpf,
        nome: consultarDto.nome,
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

  async updateIngressosDisponiveis(id: number, quantidade: number) {
    return this.prisma.evento.update({
      where: { id },
      data: {
        ingressosDisponiveis: quantidade,
      },
    });
  }

  async createConvidado(createConvidadoDto: CreateConvidadoDto) {
    // Verificar se o evento existe
    const evento = await this.prisma.evento.findUnique({
      where: { id: createConvidadoDto.eventoId },
    });

    if (!evento) {
      throw new NotFoundException(
        `Evento com ID ${createConvidadoDto.eventoId} não encontrado`,
      );
    }

    // Verificar se ainda há ingressos disponíveis
    if (evento.ingressosDisponiveis <= 0) {
      throw new BadRequestException(
        'Não há mais ingressos disponíveis para este evento',
      );
    }

    // Verificar se o CPF já está cadastrado para este evento
    const convidadoExistente = await this.prisma.convidado.findFirst({
      where: {
        eventoId: createConvidadoDto.eventoId,
        cpf: createConvidadoDto.cpf,
      },
    });

    if (convidadoExistente) {
      throw new BadRequestException('CPF já cadastrado para este evento');
    }

    // Criar o convidado
    const convidado = await this.prisma.convidado.create({
      data: {
        nome: createConvidadoDto.nome,
        cpf: createConvidadoDto.cpf,
        email: createConvidadoDto.email,
        eventoId: createConvidadoDto.eventoId,
        status: 'pendente',
      },
    });

    // Atualizar ingressos disponíveis
    await this.prisma.evento.update({
      where: { id: createConvidadoDto.eventoId },
      data: {
        ingressosDisponiveis: evento.ingressosDisponiveis - 1,
      },
    });

    return convidado;
  }

  async consultarStatus(consultarStatusDto: ConsultarStatusDto) {
    const { cpf, email } = consultarStatusDto;

    if (!cpf && !email) {
      throw new BadRequestException('CPF ou email deve ser fornecido');
    }

    const whereCondition: any = {};

    if (cpf) {
      whereCondition.cpf = cpf;
    }

    if (email) {
      whereCondition.email = email;
    }

    const convidado = await this.prisma.convidado.findFirst({
      where: whereCondition,
      include: {
        evento: {
          select: {
            id: true,
            nome: true,
            data: true,
            local: true,
          },
        },
      },
    });

    if (!convidado) {
      throw new NotFoundException('Convidado não encontrado');
    }

    return {
      status: convidado.status,
      evento: {
        nome: convidado.evento.nome,
        data: convidado.evento.data,
        local: convidado.evento.local,
      },
    };
  }

  async updateStatus(updateStatusDto: UpdateStatusDto) {
    const { email, status } = updateStatusDto;

    // Buscar o convidado pelo email
    const convidado = await this.prisma.convidado.findFirst({
      where: { email },
      include: {
        evento: {
          select: {
            id: true,
            nome: true,
            data: true,
            local: true,
          },
        },
      },
    });

    if (!convidado) {
      throw new NotFoundException('Convidado não encontrado');
    }

    // Atualizar o status
    const convidadoAtualizado = await this.prisma.convidado.update({
      where: { id: convidado.id },
      data: { status },
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

    return {
      status: convidadoAtualizado.status,
      evento: {
        nome: convidadoAtualizado.evento.nome,
        data: convidadoAtualizado.evento.data,
        local: convidadoAtualizado.evento.local,
      },
    };
  }
}
