import { PartialType } from '@nestjs/mapped-types';
import { CreateGoleadorDto } from './create-goleador.dto';

export class UpdateGoleadorDto extends PartialType(CreateGoleadorDto) {}