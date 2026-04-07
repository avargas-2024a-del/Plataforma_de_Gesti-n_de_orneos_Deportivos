import { IsString, IsNotEmpty, IsDateString, IsEnum, IsOptional, IsBoolean } from 'class-validator';

export enum FormatoTorneo {
  LIGA = 'liga',
  ELIMINACION = 'eliminacion',
}

export enum DeporteTorneo {
  FUTBOL = 'futbol',
  BALONCESTO = 'baloncesto',
  VOLEIBOL = 'voleibol',
}

export class CreateTorneoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsEnum(DeporteTorneo)
  @IsNotEmpty()
  deporte: DeporteTorneo;

  @IsDateString()
  @IsNotEmpty()
  fechaInicio: string;

  @IsDateString()
  @IsNotEmpty()
  fechaFin: string;

  @IsEnum(FormatoTorneo)
  @IsNotEmpty()
  formato: FormatoTorneo;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}