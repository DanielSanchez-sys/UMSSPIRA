import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * DTO para actualizar el perfil corporativo de una empresa.
 * IMPORTANTE: El campo NIT/RUC NO esta incluido aqui porque es inmutable.
 * El backend debe rechazar cualquier intento de modificarlo.
 */
export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  razonSocial?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  eslogan?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  descripcionLarga?: string;

  @IsOptional()
  @IsString()
  @MaxLength(45)
  tamanoEmpresa?: string;

  @IsOptional()
  @IsString()
  @MaxLength(45)
  sitioWeb?: string;

  @IsOptional()
  @IsEmail()
  correo?: string;
}