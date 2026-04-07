import { IsString, IsNotEmpty, IsInt, IsDateString, IsOptional } from 'class-validator';

export class CreateJugadorDto {
  @IsString()
  @IsNotEmpty()
  nombres: string;

  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @IsInt()
  @IsNotEmpty()
  dorsal: number;

  @IsString()
  @IsNotEmpty()
  posicion: string;

  @IsDateString()
  @IsOptional()
  fechaNacimiento?: string;

  @IsInt()
  @IsNotEmpty()
  equipoId: number;
}