import { Module } from '@nestjs/common';
import { ResultadoService } from './resultado.service';
import { ResultadoController } from './resultado.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ResultadoController],
  providers: [ResultadoService],
  exports: [ResultadoService],
})
export class ResultadoModule {}
