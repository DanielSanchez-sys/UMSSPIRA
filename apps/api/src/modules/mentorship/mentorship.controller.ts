import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { UpdateMentorAreasDto } from './dto/update-mentor-areas.dto';
import { UpdateParticipationDto } from './dto/update-participation.dto';
import { Mentor } from './mentor.model';
import {
  MentorAreasState,
  MentorshipService,
  ModuleStatus,
} from './mentorship.service';

/** Se asume que el guard de autenticación del equipo inyecta req.user.id. */
type AuthenticatedRequest = Request & { user?: { id?: string } };

// TODO: aplicar el guard de autenticación del proyecto a nivel de clase:
// @UseGuards(AuthGuard)
@Controller('mentorship')
export class MentorshipController {
  constructor(private readonly mentorshipService: MentorshipService) {}

  @Get('status')
  getStatus(): Promise<ModuleStatus> {
    return this.mentorshipService.getStatus();
  }

  @Get('profiles')
  getProfiles(): Promise<Mentor[]> {
    return this.mentorshipService.getActiveProfiles();
  }

  @Get('mi-perfil')
  getMyProfile(@Req() req: AuthenticatedRequest): Promise<Mentor> {
    return this.mentorshipService.getMyProfile(this.userId(req));
  }

  @Post('profiles/reset')
  @HttpCode(HttpStatus.OK)
  resetMyProfile(@Req() req: AuthenticatedRequest): Promise<Mentor> {
    return this.mentorshipService.resetMyProfile(this.userId(req));
  }

  @Post('eligibility')
  @HttpCode(HttpStatus.OK)
  checkEligibility(@Req() req: AuthenticatedRequest): Promise<{ eligible: boolean }> {
    return this.mentorshipService.checkEligibility(this.userId(req));
  }

  @Patch('mi-perfil/participacion')
  setParticipation(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateParticipationDto,
  ): Promise<Mentor> {
    return this.mentorshipService.setParticipation(this.userId(req), dto);
  }

  @Get('my-profile/areas')
  getMyAreas(@Req() req: AuthenticatedRequest): Promise<MentorAreasState> {
    return this.mentorshipService.getMyAreas(this.userId(req));
  }

  @Patch('my-profile/areas')
  updateMyAreas(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateMentorAreasDto,
  ): Promise<MentorAreasState> {
    return this.mentorshipService.updateMyAreas(this.userId(req), dto);
  }

  // TODO: restringir a administradores con el guard de roles del proyecto.
  @Patch('deactivate/:userId')
  deactivate(@Param('userId', ParseUUIDPipe) userId: string): Promise<Mentor> {
    return this.mentorshipService.deactivateByAdmin(userId);
  }

  /** Evita un 500 si el guard de auth aún no inyectó el usuario. */
  private userId(req: AuthenticatedRequest): string {
    const id = req.user?.id;
    if (!id) {
      throw new UnauthorizedException('Usuario no autenticado');
    }
    return id;
  }
}
