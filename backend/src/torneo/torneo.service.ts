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
}
