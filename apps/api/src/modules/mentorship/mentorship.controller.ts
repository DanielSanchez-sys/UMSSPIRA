import {
    BadRequestException,
    Controller,
    ConflictException,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    Patch,
    Post,
    Body,
} from '@nestjs/common';
import { MentorshipEligibilityService } from './mentorship-eligibility.service';
import { MentorEligibilityProfile } from './mentor-eligibility.types';
import { SupabaseService } from '../../shared/lib/supabase';

@Controller('mentorship')
export class MentorshipController {
    constructor(
        private readonly mentorshipEligibilityService: MentorshipEligibilityService,
        private readonly supabaseService: SupabaseService,
    ) {}

    @Get('status')
    getStatus() {
        return { mode: this.supabaseService.isConfigured ? 'supabase' : 'demo' };
    }

    @Get('profiles')
    getProfiles() {
        return this.supabaseService.getMentorProfiles();
    }

    @Get('mi-perfil')
    async getMyMentorParticipation() {
        const profile = await this.supabaseService.getCurrentMentorProfile();
        return this.mentorshipEligibilityService.evaluate(profile);
    }

    @Post('profiles/reset')
    resetProfiles() {
        return this.supabaseService.resetDemoProfiles();
    }

    @Post('eligibility')
    @HttpCode(HttpStatus.OK)
    evaluateEligibility(@Body('profile') profile: unknown) {
        return this.mentorshipEligibilityService.evaluate(profile);
    }

    @Patch('mi-perfil/participacion')
    @HttpCode(HttpStatus.OK)
    async updateMyMentorParticipation(@Body() body: { isActive?: boolean }) {
        if (typeof body?.isActive !== 'boolean') {
            throw new BadRequestException('Envía "isActive" con un valor booleano.');
        }

        const profile = await this.supabaseService.getCurrentMentorProfile();
        const result = this.mentorshipEligibilityService.evaluate(profile);
        if (body.isActive && (!result.requirements.egresado || !result.requirements.perfil)) {
            throw new ConflictException(result);
        }

        if (body.isActive) {
            await this.supabaseService.activateMentor(profile.userId);
        } else {
            const retainedSettings = {
                ...profile.mentorSettings,
                bio: profile.mentorSettings?.bio ?? profile.description,
            };
            await this.supabaseService.deactivateMentor(
                profile.userId,
                undefined,
                retainedSettings,
            );
        }

        return { ...result, isActive: body.isActive };
    }

    @Patch('deactivate/:userId')
    @HttpCode(HttpStatus.OK)
    deactivateMentor(
        @Param('userId') userId: string,
        @Body() body: { profile?: MentorEligibilityProfile; reason?: unknown } | null,
    ) {
        const requestBody = body ?? {};
        const reason = requestBody.reason;
        if (reason !== undefined && typeof reason !== 'string') {
            throw new BadRequestException('El motivo de desactivación debe ser texto.');
        }
        return this.deactivate(userId, {
            profile: requestBody.profile,
            ...(typeof reason === 'string' ? { reason } : {}),
        });
    }

    private async deactivate(
        userId: string,
        body: { profile?: MentorEligibilityProfile; reason?: string },
    ) {
        const storedProfile = await this.supabaseService.getMentorProfile(userId);
        const profile = storedProfile
            ?? (this.supabaseService.isConfigured ? undefined : body.profile);
        if (!profile) {
            throw new NotFoundException('No se encontró el perfil de mentor indicado.');
        }

        const result = this.mentorshipEligibilityService.deactivateMentorRole(profile, {
            userId,
            reason: body.reason,
        });
        await this.supabaseService.deactivateMentor(userId, body.reason, result.retainedSettings);
        return result;
    }
}