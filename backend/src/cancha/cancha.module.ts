import { Module } from '@nestjs/common';
import { CanchaService } from './cancha.service';
import { CanchaController } from './cancha.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CanchaController],
  providers: [CanchaService],
  exports: [CanchaService],
})
export class CanchaModule {}
