import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIngressoDto } from './dto/create-ingresso.dto';
import { ConsultarIngressoDto } from './dto/consultar-ingresso.dto';
import * as crypto from 'crypto';

@Injectable()
export class IngressosService {
  constructor(private prisma: PrismaService) {}

  async create(createIngressoDto: CreateIngressoDto) {
    // Verificar se o evento existe
    const evento = await this.prisma.evento.findUnique({
      where: { id: createIngressoDto.eventoId },
    });

    if (!evento) {
      throw new NotFoundException('Evento não encontrado');
    }

    // Verificar se há ingressos disponíveis
    const ingressosVendidos = await this.prisma.ingresso.count({
      where: {
        eventoId: createIngressoDto.eventoId,
        status: 'ativo',
      },
    });

    if (ingressosVendidos >= evento.ingressosTotal) {
      throw new BadRequestException(
        'Não há ingressos disponíveis para este evento',
      );
    }

    // Verificar se já existe ingresso para este CPF neste evento (apenas se CPF foi fornecido)
    if (createIngressoDto.cpf) {
      const ingressoExistente = await this.prisma.ingresso.findFirst({
        where: {
          eventoId: createIngressoDto.eventoId,
          cpf: createIngressoDto.cpf,
          status: 'ativo',
        },
      });

      if (ingressoExistente) {
        throw new BadRequestException(
          'Já existe um ingresso ativo para este CPF neste evento',
        );
      }
    }

    // Gerar hash único para o ingresso
    const hash = this.generateIngressoHash(
      createIngressoDto.cpf || '',
      createIngressoDto.eventoId,
    );

    return this.prisma.ingresso.create({
      data: {
        eventoId: createIngressoDto.eventoId,
        nomeEvento: createIngressoDto.nomeEvento || evento.nome, // Usa o nome fornecido ou do evento
        nome: createIngressoDto.nome,
        email: createIngressoDto.email,
        hash,
        status: createIngressoDto.status || 'ativo',
        ...(createIngressoDto.cpf && { cpf: createIngressoDto.cpf }),
      },
      include: {
        evento: true,
      },
    });
  }

  async findAll() {
    return this.prisma.ingresso.findMany({
      include: {
        evento: true,
      },
      orderBy: {
        dataCompra: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const ingresso = await this.prisma.ingresso.findUnique({
      where: { id },
      include: {
        evento: true,
      },
    });

    if (!ingresso) {
      throw new NotFoundException(`Ingresso com ID ${id} não encontrado`);
    }

    return ingresso;
  }

  async consultar(consultarIngressoDto: ConsultarIngressoDto) {
    const { cpf, nome } = consultarIngressoDto;

    if (!cpf && !nome) {
      throw new BadRequestException(
        'Informe pelo menos CPF ou nome para consulta',
      );
    }

    const whereClause: {
      status: string;
      cpf?: string;
      nome?: { contains: string; mode: 'insensitive' };
    } = {
      status: 'ativo',
    };

    if (cpf) {
      whereClause.cpf = cpf;
    }

    if (nome) {
      whereClause.nome = {
        contains: nome,
        mode: 'insensitive',
      };
    }

    const ingressos = await this.prisma.ingresso.findMany({
      where: whereClause,
      include: {
        evento: true,
      },
      orderBy: {
        dataCompra: 'desc',
      },
    });

    if (ingressos.length === 0) {
      throw new NotFoundException(
        'Nenhum ingresso encontrado com os dados informados',
      );
    }

    return ingressos;
  }

  async findByHash(hash: string) {
    const ingresso = await this.prisma.ingresso.findUnique({
      where: { hash },
      include: {
        evento: true,
      },
    });

    if (!ingresso) {
      throw new NotFoundException('Ingresso não encontrado');
    }

    return ingresso;
  }

  async updateStatus(id: string, status: string) {
    await this.findOne(id); // Verifica se existe

    return this.prisma.ingresso.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Verifica se existe

    return this.prisma.ingresso.delete({
      where: { id },
    });
  }

  private generateIngressoHash(cpf: string, eventoId: string): string {
    const timestamp = Date.now().toString();
    const data = `${cpf}-${eventoId}-${timestamp}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  async getEstatisticas() {
    const totalIngressos = await this.prisma.ingresso.count();
    const ingressosAtivos = await this.prisma.ingresso.count({
      where: { status: 'ativo' },
    });
    const ingressosUsados = await this.prisma.ingresso.count({
      where: { status: 'usado' },
    });
    const ingressosCancelados = await this.prisma.ingresso.count({
      where: { status: 'cancelado' },
    });

    return {
      total: totalIngressos,
      ativos: ingressosAtivos,
      usados: ingressosUsados,
      cancelados: ingressosCancelados,
    };
  }
}
