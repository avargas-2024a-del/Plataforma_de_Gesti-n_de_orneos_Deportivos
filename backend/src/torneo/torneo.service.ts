import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTorneoDto } from './dto/create-torneo.dto';
import { UpdateTorneoDto } from './dto/update-torneo.dto';

@Injectable()
export class TorneoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTorneoDto: CreateTorneoDto) {
    const { fechaInicio, fechaFin, ...rest } = createTorneoDto;

    if (new Date(fechaFin) <= new Date(fechaInicio)) {
      throw new BadRequestException('La fecha de fin debe ser posterior a la fecha de inicio');
    }

    return this.prisma.torneo.create({
      data: {
        ...rest,
        fechaInicio: new Date(fechaInicio),
        fechaFin: new Date(fechaFin),
      },
    });
  }

  async findAll() {
    return this.prisma.torneo.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const torneo = await this.prisma.torneo.findUnique({
      where: { id },
    });
    if (!torneo) throw new NotFoundException(`Torneo #${id} no encontrado`);
    return torneo;
  }

  async update(id: number, updateTorneoDto: UpdateTorneoDto) {
    await this.findOne(id);
    const { fechaInicio, fechaFin, ...rest } = updateTorneoDto;
    return this.prisma.torneo.update({
      where: { id },
      data: {
        ...rest,
        ...(fechaInicio && { fechaInicio: new Date(fechaInicio) }),
        ...(fechaFin && { fechaFin: new Date(fechaFin) }),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.torneo.delete({ where: { id } });
  }

  async tablaPosiciones(torneoId: number) {
    await this.findOne(torneoId);

    const partidos = await this.prisma.partido.findMany({
      where: { torneoId, estado: 'jugado' },
      include: { resultado: true },
    });

    const equipos = await this.prisma.equipo.findMany({
      where: { torneoId },
    });

    const tabla = equipos.map((equipo) => {
      let PJ = 0, PG = 0, PE = 0, PP = 0, GF = 0, GC = 0, PTS = 0;

      partidos.forEach((partido) => {
        if (!partido.resultado) return;
        const esLocal = partido.equipoLocalId === equipo.id;
        const esVisitante = partido.equipoVisitanteId === equipo.id;
        if (!esLocal && !esVisitante) return;

        PJ++;
        const golesA = esLocal ? partido.resultado.golesLocal : partido.resultado.golesVisitante;
        const golesC = esLocal ? partido.resultado.golesVisitante : partido.resultado.golesLocal;
        GF += golesA;
        GC += golesC;

        if (golesA > golesC) { PG++; PTS += 3; }
        else if (golesA === golesC) { PE++; PTS += 1; }
        else { PP++; }
      });

      return {
        equipo: equipo.nombre,
        PJ, PG, PE, PP, GF, GC,
        DG: GF - GC,
        PTS,
      };
    });

    return tabla.sort((a, b) =>
      b.PTS - a.PTS || b.DG - a.DG || b.GF - a.GF
    );
  }
}