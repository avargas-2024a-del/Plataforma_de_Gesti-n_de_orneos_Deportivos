import { IsInt, IsNotEmpty, IsDateString, IsString, IsOptional } from 'class-validator';

export class CreatePartidoDto {
  @IsInt()
  @IsNotEmpty()
  torneoId: number;

  @IsInt()
  @IsNotEmpty()
  equipoLocalId: number;

  @IsInt()
  @IsNotEmpty()
  equipoVisitanteId: number;

  @IsInt()
  @IsNotEmpty()
  canchaId: number;

  @IsDateString()
  @IsNotEmpty()
  fecha: string;

  @IsString()
  @IsNotEmpty()
  hora: string;

  @IsString()
  @IsOptional()
  estado?: string;
}