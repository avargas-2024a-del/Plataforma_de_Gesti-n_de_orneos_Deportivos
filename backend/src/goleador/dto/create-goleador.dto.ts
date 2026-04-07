import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateGoleadorDto {
  @IsInt()
  @IsNotEmpty()
  resultadoId: number;

  @IsInt()
  @IsNotEmpty()
  jugadorId: number;

  @IsInt()
  @Min(1)
  cantidad: number;
}