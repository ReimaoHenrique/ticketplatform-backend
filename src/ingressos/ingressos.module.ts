import { Module } from '@nestjs/common';
import { IngressosService } from './ingressos.service';
import { IngressosController } from './ingressos.controller';

@Module({
  controllers: [IngressosController],
  providers: [IngressosService],
  exports: [IngressosService],
})
export class IngressosModule {}

