import { IsString, IsNotEmpty, IsOptional, IsUrl, IsInt } from 'class-validator';

export class CreateEquipoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  escudo?: string;

  @IsString()
  @IsNotEmpty()
  directorTecnico: string;

  @IsInt()
  @IsNotEmpty()
  torneoId: number;
}