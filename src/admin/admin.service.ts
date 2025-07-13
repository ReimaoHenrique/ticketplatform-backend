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
    // Buscar dados dos eventos
    const eventos = await this.prisma.evento.findMany({
      orderBy: {
        data: 'desc',
      },
    });

    // Calcular métricas gerais
    const totalEventos = eventos.length;
    const totalConvidadosConfirmados = await this.prisma.convidado.count({
      where: { status: 'confirmado' },
    });
    const lucroAtual = eventos.reduce(
      (acc, evento) =>
        acc +
        (evento.ingressosTotal - evento.ingressosDisponiveis) * evento.preco,
      0,
    );
    const lucroPotencial = eventos.reduce(
      (acc, evento) => acc + evento.ingressosTotal * evento.preco,
      0,
    );

    return {
      metricas: {
        totalEventos,
        totalConvidadosConfirmados,
        lucroAtual,
        lucroPotencial,
      },
      eventos: eventos.map((evento) => ({
        ...evento,
        vendidos: evento.ingressosTotal - evento.ingressosDisponiveis,
        lucroAtual:
          (evento.ingressosTotal - evento.ingressosDisponiveis) * evento.preco,
        lucroPotencial: evento.ingressosTotal * evento.preco,
        percentualVendido: Math.round(
          ((evento.ingressosTotal - evento.ingressosDisponiveis) /
            evento.ingressosTotal) *
            100,
        ),
      })),
    };
  }

  async getEstatisticasGerais() {
    // Estatísticas de eventos
    const totalEventos = await this.prisma.evento.count();
    const eventosAtivos = await this.prisma.evento.count({
      where: { status: 'ativo' },
    });

    // Estatísticas de convidados
    const totalConvidados = await this.prisma.convidado.count();
    const convidadosConfirmados = await this.prisma.convidado.count({
      where: { status: 'confirmado' },
    });

    // Receita total
    const eventos = await this.prisma.evento.findMany();
    const receitaTotal = eventos.reduce(
      (acc, evento) =>
        acc +
        (evento.ingressosTotal - evento.ingressosDisponiveis) * evento.preco,
      0,
    );
    const receitaPotencial = eventos.reduce(
      (acc, evento) => acc + evento.ingressosTotal * evento.preco,
      0,
    );

    return {
      eventos: {
        total: totalEventos,
        ativos: eventosAtivos,
      },
      convidados: {
        total: totalConvidados,
        confirmados: convidadosConfirmados,
      },
      receita: {
        atual: receitaTotal,
        potencial: receitaPotencial,
        percentual:
          receitaPotencial > 0
            ? Math.round((receitaTotal / receitaPotencial) * 100)
            : 0,
      },
    };
  }

  async verificarHash(hash: string): Promise<boolean> {
    const adminHash = this.configService.get<string>('ADMIN_HASH');
    return hash === adminHash;
  }
}
