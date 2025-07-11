import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { LoginAdminDto } from './dto/login-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async login(loginAdminDto: LoginAdminDto) {
    const { hash } = loginAdminDto;
    const adminHash = this.configService.get<string>('ADMIN_HASH');

    if (hash !== adminHash) {
      throw new UnauthorizedException('Hash de administrador inválido');
    }

    return {
      sucesso: true,
      mensagem: 'Login realizado com sucesso',
      admin: true,
    };
  }

  async getDashboardData() {
    // Buscar dados das festas
    const festas = await this.prisma.festa.findMany({
      orderBy: {
        data: 'desc',
      },
    });

    // Calcular métricas gerais
    const totalEventos = festas.length;
    const totalIngressosVendidos = festas.reduce((acc, festa) => acc + festa.quantidadeVendidos, 0);
    const lucroAtual = festas.reduce((acc, festa) => acc + (festa.quantidadeVendidos * festa.valorUnitario), 0);
    const lucroPotencial = festas.reduce((acc, festa) => acc + (festa.quantidadeTotal * festa.valorUnitario), 0);

    return {
      metricas: {
        totalEventos,
        totalIngressosVendidos,
        lucroAtual,
        lucroPotencial,
      },
      festas: festas.map(festa => ({
        ...festa,
        lucroAtual: festa.quantidadeVendidos * festa.valorUnitario,
        lucroPotencial: festa.quantidadeTotal * festa.valorUnitario,
        percentualVendido: Math.round((festa.quantidadeVendidos / festa.quantidadeTotal) * 100),
      })),
    };
  }

  async getFestas() {
    const festas = await this.prisma.festa.findMany({
      orderBy: {
        data: 'desc',
      },
    });

    return festas.map(festa => ({
      id: festa.id,
      nome: festa.nome,
      data: festa.data,
      status: festa.status,
      totalIngressos: festa.quantidadeTotal,
      vendidos: festa.quantidadeVendidos,
      valorUnitario: festa.valorUnitario,
      lucroAtual: festa.quantidadeVendidos * festa.valorUnitario,
      lucroPotencial: festa.quantidadeTotal * festa.valorUnitario,
      percentualVendido: Math.round((festa.quantidadeVendidos / festa.quantidadeTotal) * 100),
    }));
  }

  async getEstatisticasGerais() {
    // Estatísticas de eventos
    const totalEventos = await this.prisma.evento.count();
    const eventosAtivos = await this.prisma.evento.count({
      where: { status: 'ativo' },
    });

    // Estatísticas de ingressos
    const totalIngressos = await this.prisma.ingresso.count();
    const ingressosAtivos = await this.prisma.ingresso.count({
      where: { status: 'ativo' },
    });

    // Estatísticas de festas
    const totalFestas = await this.prisma.festa.count();
    const festasAtivas = await this.prisma.festa.count({
      where: { status: 'ativa' },
    });

    // Receita total
    const festas = await this.prisma.festa.findMany();
    const receitaTotal = festas.reduce((acc, festa) => acc + (festa.quantidadeVendidos * festa.valorUnitario), 0);
    const receitaPotencial = festas.reduce((acc, festa) => acc + (festa.quantidadeTotal * festa.valorUnitario), 0);

    return {
      eventos: {
        total: totalEventos,
        ativos: eventosAtivos,
      },
      ingressos: {
        total: totalIngressos,
        ativos: ingressosAtivos,
      },
      festas: {
        total: totalFestas,
        ativas: festasAtivas,
      },
      receita: {
        atual: receitaTotal,
        potencial: receitaPotencial,
        percentual: receitaPotencial > 0 ? Math.round((receitaTotal / receitaPotencial) * 100) : 0,
      },
    };
  }

  async verificarHash(hash: string): Promise<boolean> {
    const adminHash = this.configService.get<string>('ADMIN_HASH');
    return hash === adminHash;
  }
}

