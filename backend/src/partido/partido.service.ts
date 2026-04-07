import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePartidoDto } from './dto/create-partido.dto';
import { UpdatePartidoDto } from './dto/update-partido.dto';

@Injectable()
export class PartidoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPartidoDto: CreatePartidoDto) {
    if (createPartidoDto.equipoLocalId === createPartidoDto.equipoVisitanteId) {
      throw new BadRequestException('Un equipo no puede jugar contra sí mismo');
    }

    const conflicto = await this.prisma.partido.findFirst({
      where: {
        canchaId: createPartidoDto.canchaId,
        fecha: new Date(createPartidoDto.fecha),
        hora: createPartidoDto.hora,
      },
    });
    if (conflicto) {
      throw new BadRequestException('Ya hay un partido programado en esa cancha a esa hora');
    }

    return this.prisma.partido.create({
      data: {
        torneoId: createPartidoDto.torneoId,
        equipoLocalId: createPartidoDto.equipoLocalId,
        equipoVisitanteId: createPartidoDto.equipoVisitanteId,
        canchaId: createPartidoDto.canchaId,
        fecha: new Date(createPartidoDto.fecha),
        hora: createPartidoDto.hora,
        estado: createPartidoDto.estado ?? 'programado',
      },
      include: {
        equipoLocal: true,
        equipoVisitante: true,
        cancha: true,
        torneo: true,
      },
    });
  }

  async findAll() {
    return this.prisma.partido.findMany({
      include: {
        equipoLocal: true,
        equipoVisitante: true,
        cancha: true,
        torneo: true,
      },
      orderBy: { fecha: 'asc' },
    });
  }

  async findOne(id: number) {
    const partido = await this.prisma.partido.findUnique({
      where: { id },
      include: {
        equipoLocal: true,
        equipoVisitante: true,
        cancha: true,
        torneo: true,
        resultado: true,
      },
    });
    if (!partido) throw new NotFoundException(`Partido #${id} no encontrado`);
    return partido;
  }

  async update(id: number, updatePartidoDto: UpdatePartidoDto) {
    const partido = await this.findOne(id);
    if (partido.resultado) {
      throw new BadRequestException('No se puede editar un partido que ya tiene resultado');
    }
    return this.prisma.partido.update({
      where: { id },
      data: {
        ...updatePartidoDto,
        ...(updatePartidoDto.fecha && { fecha: new Date(updatePartidoDto.fecha) }),
      },
      include: {
        equipoLocal: true,
        equipoVisitante: true,
        cancha: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.partido.delete({ where: { id } });
  }
}