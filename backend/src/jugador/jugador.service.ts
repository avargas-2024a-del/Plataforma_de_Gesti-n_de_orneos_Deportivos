import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJugadorDto } from './dto/create-jugador.dto';
import { UpdateJugadorDto } from './dto/update-jugador.dto';

@Injectable()
export class JugadorService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createJugadorDto: CreateJugadorDto) {
    const dorsalExiste = await this.prisma.jugador.findFirst({
      where: {
        dorsal: createJugadorDto.dorsal,
        equipoId: createJugadorDto.equipoId,
      },
    });
    if (dorsalExiste) {
      throw new ConflictException('Ya existe un jugador con ese dorsal en este equipo');
    }
    return this.prisma.jugador.create({
      data: {
        nombres: createJugadorDto.nombres,
        apellidos: createJugadorDto.apellidos,
        dorsal: createJugadorDto.dorsal,
        posicion: createJugadorDto.posicion,
        equipoId: createJugadorDto.equipoId,
        ...(createJugadorDto.fechaNacimiento && {
          fechaNacimiento: new Date(createJugadorDto.fechaNacimiento),
        }),
      },
      include: { equipo: true },
    });
  }

  async findAll() {
    return this.prisma.jugador.findMany({
      include: { equipo: true },
      orderBy: { apellidos: 'asc' },
    });
  }

  async findOne(id: number) {
    const jugador = await this.prisma.jugador.findUnique({
      where: { id },
      include: { equipo: true },
    });
    if (!jugador) throw new NotFoundException(`Jugador #${id} no encontrado`);
    return jugador;
  }

  async update(id: number, updateJugadorDto: UpdateJugadorDto) {
    await this.findOne(id);
    const { fechaNacimiento, ...rest } = updateJugadorDto;
    return this.prisma.jugador.update({
      where: { id },
      data: {
        ...rest,
        ...(fechaNacimiento && {
          fechaNacimiento: new Date(fechaNacimiento),
        }),
      },
      include: { equipo: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.jugador.delete({ where: { id } });
  }
}
