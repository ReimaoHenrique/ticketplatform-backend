import {
  Controller,
  Get,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { LoginAdminDto } from './dto/login-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginAdminDto: LoginAdminDto) {
    return this.adminService.login(loginAdminDto);
  }

  @Get('dashboard')
  async getDashboard(@Headers('authorization') authorization?: string) {
    // Verificar autorização simples baseada no hash
    if (!authorization) {
      throw new UnauthorizedException('Token de autorização necessário');
    }

    const hash = authorization.replace('Bearer ', '');
    const isValid = await this.adminService.verificarHash(hash);

    if (!isValid) {
      throw new UnauthorizedException('Token de autorização inválido');
    }

    const data = await this.adminService.getDashboardData();
    return {
      sucesso: true,
      data,
    };
  }

  @Get('festas')
  async getFestas(@Headers('authorization') authorization?: string) {
    // Verificar autorização simples baseada no hash
    if (!authorization) {
      throw new UnauthorizedException('Token de autorização necessário');
    }

    const hash = authorization.replace('Bearer ', '');
    const isValid = await this.adminService.verificarHash(hash);

    if (!isValid) {
      throw new UnauthorizedException('Token de autorização inválido');
    }

    const festas = await this.adminService.getFestas();
    return {
      sucesso: true,
      data: festas,
    };
  }

  @Get('estatisticas')
  async getEstatisticas(@Headers('authorization') authorization?: string) {
    // Verificar autorização simples baseada no hash
    if (!authorization) {
      throw new UnauthorizedException('Token de autorização necessário');
    }

    const hash = authorization.replace('Bearer ', '');
    const isValid = await this.adminService.verificarHash(hash);

    if (!isValid) {
      throw new UnauthorizedException('Token de autorização inválido');
    }

    const estatisticas = await this.adminService.getEstatisticasGerais();
    return {
      sucesso: true,
      data: estatisticas,
    };
  }

  @Post('verificar-hash')
  @HttpCode(HttpStatus.OK)
  async verificarHash(@Body('hash') hash: string) {
    const isValid = await this.adminService.verificarHash(hash);
    return {
      sucesso: true,
      valido: isValid,
    };
  }
}

