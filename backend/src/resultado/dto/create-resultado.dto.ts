import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateResultadoDto {
  @IsInt()
  @IsNotEmpty()
  partidoId: number;

  @IsInt()
  @Min(0)
  golesLocal: number;

  @IsInt()
  @Min(0)
  golesVisitante: number;
}