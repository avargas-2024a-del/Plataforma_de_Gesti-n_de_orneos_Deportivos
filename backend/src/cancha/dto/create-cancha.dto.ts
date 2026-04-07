import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';

export class CreateCanchaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  direccion?: string;

  @IsString()
  @IsOptional()
  tipoSuperficie?: string;

  @IsInt()
  @IsOptional()
  capacidad?: number;
}