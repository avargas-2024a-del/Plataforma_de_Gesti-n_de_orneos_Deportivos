import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { GoleadorService } from './goleador.service';
import { CreateGoleadorDto } from './dto/create-goleador.dto';
import { UpdateGoleadorDto } from './dto/update-goleador.dto';

@Controller('goleador')
export class GoleadorController {
  constructor(private readonly goleadorService: GoleadorService) {}

  @Post()
  create(@Body() createGoleadorDto: CreateGoleadorDto) {
    return this.goleadorService.create(createGoleadorDto);
  }

  @Get()
  findAll() {
    return this.goleadorService.findAll();
  }

  @Get('ranking/:torneoId')
  rankingGoleadores(@Param('torneoId', ParseIntPipe) torneoId: number) {
    return this.goleadorService.rankingGoleadores(torneoId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.goleadorService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGoleadorDto: UpdateGoleadorDto,
  ) {
    return this.goleadorService.update(id, updateGoleadorDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.goleadorService.remove(id);
  }
}