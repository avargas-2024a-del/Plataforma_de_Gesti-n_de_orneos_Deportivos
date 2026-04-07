import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResultadoDto } from './dto/create-resultado.dto';
import { UpdateResultadoDto } from './dto/update-resultado.dto';

@Injectable()
export class ResultadoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createResultadoDto: CreateResultadoDto) {
    const partido = await this.prisma.partido.findUnique({
      where: { id: createResultadoDto.partidoId },
      include: { resultado: true },
    });

    if (!partido) {
      throw new NotFoundException(`Partido #${createResultadoDto.partidoId} no encontrado`);
    }

    if (partido.estado === 'cancelado') {
      throw new BadRequestException('No se puede registrar resultado de un partido cancelado');
    }

    if (partido.resultado) {
      throw new BadRequestException('Este partido ya tiene un resultado registrado');
    }

    const resultado = await this.prisma.resultado.create({
      data: {
        partidoId: createResultadoDto.partidoId,
        golesLocal: createResultadoDto.golesLocal,
        golesVisitante: createResultadoDto.golesVisitante,
      },
      include: { partido: true },
    });

    await this.prisma.partido.update({
      where: { id: createResultadoDto.partidoId },
      data: { estado: 'jugado' },
    });

    return resultado;
  }

  async findAll() {
    return this.prisma.resultado.findMany({
      include: { partido: true },
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    const resultado = await this.prisma.resultado.findUnique({
      where: { id },
      include: { partido: true },
    });
    if (!resultado) throw new NotFoundException(`Resultado #${id} no encontrado`);
    return resultado;
  }

  async update(id: number, updateResultadoDto: UpdateResultadoDto) {
    await this.findOne(id);
    return this.prisma.resultado.update({
      where: { id },
      data: updateResultadoDto,
      include: { partido: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.resultado.delete({ where: { id } });
  }
}
