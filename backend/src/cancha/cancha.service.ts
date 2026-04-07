import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCanchaDto } from './dto/create-cancha.dto';
import { UpdateCanchaDto } from './dto/update-cancha.dto';

@Injectable()
export class CanchaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCanchaDto: CreateCanchaDto) {
    return this.prisma.cancha.create({
      data: {
        nombre: createCanchaDto.nombre,
        direccion: createCanchaDto.direccion ?? '',
        tipoSuperficie: createCanchaDto.tipoSuperficie ?? '',
        capacidad: createCanchaDto.capacidad ?? 0,
      },
    });
  }

  async findAll() {
    return this.prisma.cancha.findMany({
      orderBy: { nombre: 'asc' },
    });
  }

  async findOne(id: number) {
    const cancha = await this.prisma.cancha.findUnique({
      where: { id },
    });
    if (!cancha) throw new NotFoundException(`Cancha #${id} no encontrada`);
    return cancha;
  }

  async update(id: number, updateCanchaDto: UpdateCanchaDto) {
    await this.findOne(id);
    return this.prisma.cancha.update({
      where: { id },
      data: updateCanchaDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.cancha.delete({ where: { id } });
  }
}
