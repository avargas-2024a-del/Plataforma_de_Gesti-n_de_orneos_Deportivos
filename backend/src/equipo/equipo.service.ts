import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { UpdateEquipoDto } from './dto/update-equipo.dto';

@Injectable()
export class EquipoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEquipoDto: CreateEquipoDto) {
    const existe = await this.prisma.equipo.findFirst({
      where: {
        nombre: createEquipoDto.nombre,
        torneoId: createEquipoDto.torneoId,
      },
    });
    if (existe) {
      throw new ConflictException('Ya existe un equipo con ese nombre en este torneo');
    }
    return this.prisma.equipo.create({
      data: {
        nombre: createEquipoDto.nombre,
        escudo: createEquipoDto.escudo ?? '',
        directorTecnico: createEquipoDto.directorTecnico,
        torneoId: createEquipoDto.torneoId,
      },
      include: { jugadores: true },
    });
  }

  async findAll() {
    return this.prisma.equipo.findMany({
      include: { jugadores: true, torneo: true },
      orderBy: { nombre: 'asc' },
    });
  }

  async findOne(id: number) {
    const equipo = await this.prisma.equipo.findUnique({
      where: { id },
      include: { jugadores: true, torneo: true },
    });
    if (!equipo) throw new NotFoundException(`Equipo #${id} no encontrado`);
    return equipo;
  }

  async update(id: number, updateEquipoDto: UpdateEquipoDto) {
    await this.findOne(id);
    return this.prisma.equipo.update({
      where: { id },
      data: updateEquipoDto,
      include: { jugadores: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.equipo.delete({ where: { id } });
  }
}