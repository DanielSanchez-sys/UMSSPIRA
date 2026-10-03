import {
    BadRequestException,
    Controller,
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

    @Post('profiles/reset')
    resetProfiles() {
        return this.supabaseService.resetDemoProfiles();
    }

    @Post('eligibility')
    @HttpCode(HttpStatus.OK)
    evaluateEligibility(@Body('profile') profile: unknown) {
        return this.mentorshipEligibilityService.evaluate(profile);
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