import { Module } from '@nestjs/common';
import { GoleadorService } from './goleador.service';
import { GoleadorController } from './goleador.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GoleadorController],
  providers: [GoleadorService],
  exports: [GoleadorService],
})
export class GoleadorModule {}
