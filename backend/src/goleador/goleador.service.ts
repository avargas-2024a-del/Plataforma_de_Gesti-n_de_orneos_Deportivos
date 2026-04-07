import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGoleadorDto } from './dto/create-goleador.dto';
import { UpdateGoleadorDto } from './dto/update-goleador.dto';

@Injectable()
export class GoleadorService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createGoleadorDto: CreateGoleadorDto) {
    const resultado = await this.prisma.resultado.findUnique({
      where: { id: createGoleadorDto.resultadoId },
      include: { partido: true },
    });

    if (!resultado) {
      throw new NotFoundException(`Resultado #${createGoleadorDto.resultadoId} no encontrado`);
    }

    const jugador = await this.prisma.jugador.findUnique({
      where: { id: createGoleadorDto.jugadorId },
    });

    if (!jugador) {
      throw new NotFoundException(`Jugador #${createGoleadorDto.jugadorId} no encontrado`);
    }

    if (
      jugador.equipoId !== resultado.partido.equipoLocalId &&
      jugador.equipoId !== resultado.partido.equipoVisitanteId
    ) {
      throw new BadRequestException('El jugador no pertenece a ninguno de los equipos del partido');
    }

    return this.prisma.goleador.create({
      data: {
        resultadoId: createGoleadorDto.resultadoId,
        jugadorId: createGoleadorDto.jugadorId,
        cantidad: createGoleadorDto.cantidad,
      },
      include: { jugador: true, resultado: true },
    });
  }

  async findAll() {
    return this.prisma.goleador.findMany({
      include: { jugador: true, resultado: true },
      orderBy: { cantidad: 'desc' },
    });
  }

  async findOne(id: number) {
    const goleador = await this.prisma.goleador.findUnique({
      where: { id },
      include: { jugador: true, resultado: true },
    });
    if (!goleador) throw new NotFoundException(`Goleador #${id} no encontrado`);
    return goleador;
  }

  async update(id: number, updateGoleadorDto: UpdateGoleadorDto) {
    await this.findOne(id);
    return this.prisma.goleador.update({
      where: { id },
      data: updateGoleadorDto,
      include: { jugador: true, resultado: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.goleador.delete({ where: { id } });
  }
}
