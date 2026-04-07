import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { TorneoService } from './torneo.service';
import { CreateTorneoDto } from './dto/create-torneo.dto';
import { UpdateTorneoDto } from './dto/update-torneo.dto';

@Controller('torneo')
export class TorneoController {
  constructor(private readonly torneoService: TorneoService) {}

  @Post()
  create(@Body() createTorneoDto: CreateTorneoDto) {
    return this.torneoService.create(createTorneoDto);
  }

  @Get()
  findAll() {
    return this.torneoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.torneoService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTorneoDto: UpdateTorneoDto,
  ) {
    return this.torneoService.update(id, updateTorneoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.torneoService.remove(id);
  }
}
