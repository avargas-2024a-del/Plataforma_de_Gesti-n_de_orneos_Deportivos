import { Module } from '@nestjs/common';
import { JugadorService } from './jugador.service';
import { JugadorController } from './jugador.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [JugadorController],
  providers: [JugadorService],
  exports: [JugadorService],
})
export class JugadorModule {}
