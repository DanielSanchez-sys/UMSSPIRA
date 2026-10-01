import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';
import { CrearFormacionAcademicaDto as CrearFormacionAcademicaContrato } from '@umsspira/shared-types';

const recortar = ({ value }) => (typeof value === 'string' ? value.trim() : value);

export class CrearFormacionAcademicaDto implements CrearFormacionAcademicaContrato {
  @Transform(recortar)
  @IsString({ message: 'La institución debe ser texto' })
  @IsNotEmpty({ message: 'La institución es obligatoria' })
  @MaxLength(150, { message: 'La institución no puede superar los 150 caracteres' })
  institucion: string;

  @Transform(recortar)
  @IsString({ message: 'El título debe ser texto' })
  @IsNotEmpty({ message: 'El título es obligatorio' })
  @MaxLength(150, { message: 'El título no puede superar los 150 caracteres' })
  titulo: string;

  @IsNotEmpty({ message: 'El año de egreso es obligatorio' })
  @IsInt({ message: 'El año de egreso debe ser un número entero' })
  @Min(1000, { message: 'El año de egreso debe tener 4 dígitos' })
  anioEgreso: number;
}
