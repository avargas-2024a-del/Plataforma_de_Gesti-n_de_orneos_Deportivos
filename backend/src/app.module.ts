import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TorneoModule } from './torneo/torneo.module';
import { EquipoModule } from './equipo/equipo.module';
import { JugadorModule } from './jugador/jugador.module';
import { CanchaModule } from './cancha/cancha.module';
import { PartidoModule } from './partido/partido.module';
import { ResultadoModule } from './resultado/resultado.module';
import { GoleadorModule } from './goleador/goleador.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    TorneoModule,
    EquipoModule,
    JugadorModule,
    CanchaModule,
    PartidoModule,
    ResultadoModule,
    GoleadorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}