import { Module } from '@nestjs/common';
import { TorneoService } from './torneo.service';
import { TorneoController } from './torneo.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TorneoController],
  providers: [TorneoService],
  exports: [TorneoService],
})
export class TorneoModule {}